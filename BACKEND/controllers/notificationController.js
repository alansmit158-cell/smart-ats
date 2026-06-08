const Application = require('../models/Application');
const Message = require('../models/Message');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// =============================================================================
// CONTROLLER : getNotifications
// Route : GET /api/notifications
// Aggregates real events from the DB per user role
// =============================================================================
const getNotifications = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const notifications = [];
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // last 7 days

    // -------------------------------------------------------------------------
    // RECRUITER: new applications, status changes, unread messages from candidates
    // -------------------------------------------------------------------------
    if (role === 'recruiter' || role === 'admin') {
      // New applications (Pending or Scored) in the last 7 days
      const newApps = await Application.find({
        createdAt: { $gte: since },
        status: { $in: ['Pending', 'Scored'] }
      })
        .populate({ path: 'candidate', populate: { path: 'user', select: 'nom prenom email' } })
        .populate('job', 'titre')
        .sort({ createdAt: -1 })
        .limit(10);

      for (const app of newApps) {
        const candidateName = app.candidate?.user?.nom
          ? `${app.candidate.user.prenom || ''} ${app.candidate.user.nom}`.trim()
          : 'Un candidat';
        const jobTitle = app.job?.titre || 'une offre';
        const isScored = app.status === 'Scored';
        notifications.push({
          id: `app_${app._id}`,
          type: isScored ? 'scoring' : 'application',
          icon: isScored ? '🎯' : '📋',
          title: isScored ? 'Nouveau score IA disponible' : 'Nouvelle candidature reçue',
          body: isScored
            ? `${candidateName} — Score ${app.scoreMatching}% pour "${jobTitle}"`
            : `${candidateName} a postulé pour "${jobTitle}"`,
          timestamp: app.createdAt,
          read: false,
          link: '/recruiter/scoring'
        });
      }

      // Unread messages received by the recruiter
      const unreadMessages = await Message.find({
        receiver: userId,
        isRead: false,
        createdAt: { $gte: since }
      })
        .populate('sender', 'nom prenom')
        .sort({ createdAt: -1 })
        .limit(5);

      for (const msg of unreadMessages) {
        const senderName = msg.sender?.nom
          ? `${msg.sender.prenom || ''} ${msg.sender.nom}`.trim()
          : 'Un utilisateur';
        notifications.push({
          id: `msg_${msg._id}`,
          type: 'message',
          icon: '💬',
          title: 'Nouveau message',
          body: `${senderName} : "${msg.content.substring(0, 60)}${msg.content.length > 60 ? '…' : ''}"`,
          timestamp: msg.createdAt,
          read: false,
          link: '/recruiter/messages'
        });
      }

      // Interviews scheduled (status = Interviewed) — alert the recruiter
      const interviews = await Application.find({
        status: 'Interviewed',
        updatedAt: { $gte: since }
      })
        .populate({ path: 'candidate', populate: { path: 'user', select: 'nom prenom' } })
        .populate('job', 'titre')
        .sort({ updatedAt: -1 })
        .limit(5);

      for (const app of interviews) {
        const candidateName = app.candidate?.user?.nom
          ? `${app.candidate.user.prenom || ''} ${app.candidate.user.nom}`.trim()
          : 'Un candidat';
        notifications.push({
          id: `interview_${app._id}`,
          type: 'interview',
          icon: '📅',
          title: 'Entretien initié',
          body: `${candidateName} est en phase d'entretien pour "${app.job?.titre || 'une offre'}"`,
          timestamp: app.updatedAt,
          read: false,
          link: '/recruiter/interviews'
        });
      }
    }

    // -------------------------------------------------------------------------
    // CANDIDATE: application status updates, unread messages from recruiter
    // -------------------------------------------------------------------------
    if (role === 'candidate') {
      // Find the candidate profile linked to this user
      const candidateProfile = await Candidate.findOne({ user: userId });

      if (candidateProfile) {
        // Application status changes
        const myApps = await Application.find({
          candidate: candidateProfile._id,
          updatedAt: { $gte: since }
        })
          .populate('job', 'titre')
          .sort({ updatedAt: -1 })
          .limit(10);

        const statusLabels = {
          Pending:    { label: 'Candidature reçue',    icon: '📋' },
          Scored:     { label: 'Score IA calculé',      icon: '🎯' },
          Reviewed:   { label: 'Dossier examiné',       icon: '👀' },
          Interviewed:{ label: 'Entretien planifié !',  icon: '📅' },
          Accepted:   { label: 'Candidature acceptée !',icon: '🎉' },
          Rejected:   { label: 'Candidature refusée',   icon: '❌' },
        };

        for (const app of myApps) {
          const info = statusLabels[app.status] || { label: app.status, icon: '🔔' };
          notifications.push({
            id: `myapp_${app._id}`,
            type: 'status',
            icon: info.icon,
            title: info.label,
            body: `Votre candidature pour "${app.job?.titre || 'une offre'}" — Statut : ${app.status}`,
            timestamp: app.updatedAt,
            read: app.status === 'Pending', // only unread for meaningful changes
            link: '/candidate/applications'
          });
        }

        // NLP parsing complete
        if (candidateProfile.status === 'completed' && candidateProfile.updatedAt >= since) {
          notifications.push({
            id: `nlp_${candidateProfile._id}`,
            type: 'scoring',
            icon: '⚡',
            title: 'CV analysé par l\'IA',
            body: 'Votre profil a été indexé. Consultez vos résultats de compatibilité.',
            timestamp: candidateProfile.updatedAt,
            read: false,
            link: '/candidate/profile'
          });
        }
      }

      // Unread messages from recruiter
      const unreadMessages = await Message.find({
        receiver: userId,
        isRead: false,
        createdAt: { $gte: since }
      })
        .populate('sender', 'nom prenom')
        .sort({ createdAt: -1 })
        .limit(5);

      for (const msg of unreadMessages) {
        const senderName = msg.sender?.nom
          ? `${msg.sender.prenom || ''} ${msg.sender.nom}`.trim()
          : 'Le recruteur';
        notifications.push({
          id: `msg_${msg._id}`,
          type: 'message',
          icon: '💬',
          title: 'Message du recruteur',
          body: `${senderName} : "${msg.content.substring(0, 60)}${msg.content.length > 60 ? '…' : ''}"`,
          timestamp: msg.createdAt,
          read: false,
          link: '/candidate/messages'
        });
      }
    }

    // -------------------------------------------------------------------------
    // ADMIN: system-level — new users, suspensions, worker failures, etc.
    // -------------------------------------------------------------------------
    if (role === 'admin') {
      // New users registered in the last 7 days
      const newUsers = await User.find({ createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .limit(5);

      for (const u of newUsers) {
        notifications.push({
          id: `user_${u._id}`,
          type: 'user',
          icon: '👤',
          title: 'Nouvel utilisateur inscrit',
          body: `${u.prenom || ''} ${u.nom} (${u.role}) — ${u.email}`.trim(),
          timestamp: u.createdAt,
          read: false,
          link: '/admin/users'
        });
      }

      // Suspended users
      const suspended = await User.find({
        status: 'suspended',
        updatedAt: { $gte: since }
      }).sort({ updatedAt: -1 }).limit(3);

      for (const u of suspended) {
        notifications.push({
          id: `susp_${u._id}`,
          type: 'security',
          icon: '🔒',
          title: 'Compte suspendu',
          body: `${u.email} a été suspendu`,
          timestamp: u.updatedAt,
          read: false,
          link: '/admin/security'
        });
      }
    }

    // Sort by most recent first
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      data: notifications.slice(0, 15) // max 15 notifications displayed
    });

  } catch (error) {
    console.error('❌ getNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des notifications.' });
  }
};

// =============================================================================
// CONTROLLER : markAllRead
// Route : PATCH /api/notifications/read
// Marks all unread messages as read for this user
// =============================================================================
const markAllRead = async (req, res) => {
  try {
    await Message.updateMany(
      { receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    return res.status(200).json({ success: true, message: 'Notifications marquées comme lues.' });
  } catch (error) {
    console.error('❌ markAllRead error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = { getNotifications, markAllRead };

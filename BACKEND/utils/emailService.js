const nodemailer = require('nodemailer');

// Setup Ethereal Email for testing purposes (fake SMTP service)
// In production, you would replace this with actual SMTP credentials (ex: Gmail, SendGrid, etc.)
let transporter;

async function setupTransporter() {
    if (!transporter) {
        // Create an ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        console.log(`✉️ Simulated Email (Ethereal) ready! Auth User: ${testAccount.user}`);
    }
    return transporter;
}

const sendInterviewEmail = async (candidateEmail, candidateName, interviewDetails) => {
    try {
        const mailTransporter = await setupTransporter();

        const formattedDate = new Date(interviewDetails.date).toLocaleString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const locationHtml = interviewDetails.type === 'Online' 
            ? `<p><strong>Lien de la réunion :</strong> <a href="${interviewDetails.meetLink}">${interviewDetails.meetLink}</a></p>`
            : `<p><strong>Lieu :</strong> ${interviewDetails.location}</p>`;

        const mailOptions = {
            from: '"Smart-ATS" <noreply@smart-ats.com>',
            to: candidateEmail,
            subject: 'Confirmation de votre entretien',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <br>
                    <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #2563eb;">Convocation d'entretien</h2>
                        <p>Bonjour <strong>${candidateName}</strong>,</p>
                        <p>Nous avons le plaisir de vous confirmer votre entretien prévu le :</p>
                        <h3 style="background: #f3f4f6; display: inline-block; padding: 8px 15px; border-radius: 5px;">${formattedDate}</h3>
                        ${locationHtml}
                        <p>Merci de vous préparer en conséquence.</p>
                        <br>
                        <p>Cordialement,<br><strong>L'équipe de Recrutement</strong></p>
                    </div>
                </div>
            `
        };

        const info = await mailTransporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${candidateEmail}`);
        console.log(`🔍 Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // Ethereal link to see the email
        
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Could not send email');
    }
};

module.exports = {
    sendInterviewEmail
};

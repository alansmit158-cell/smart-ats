import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Search,
  Sparkles,
  CheckCheck
} from 'lucide-react';

const CandidateChat = () => {
    const [message, setMessage] = useState('');
    
    // Son cristallin "Luxe" (Base64 short chime)
    const playCrystalSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YS9vT18A/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/sw==');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Interaction utilisateur requise pour le son"));
    };

    React.useEffect(() => {
        // Simuler la réception d'un conseil IA après 2 secondes
        const timer = setTimeout(() => {
            playCrystalSound();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const contacts = [
        { id: 1, name: 'Alice Deroche', role: 'RH chez Tech Horizon', online: true, img: 'AD' },
        { id: 2, name: 'Jean-Marc Léo', role: 'CTO chez Data Metrics', online: false, img: 'JL' },
        { id: 3, name: 'Sarah B.', role: 'Talent Acquisition Freelance', online: true, img: 'SB' },
    ];

    const messages = [
        { id: 1, sender: 'Alice Deroche', text: 'Bonjour ! J\'ai bien reçu votre CV analysé par Smart-ATS. Votre score de match sur le poste Senior React est excellent.', time: '09:30', me: false },
        { id: 2, sender: 'Moi', text: 'Bonjour Alice. Ravi de l\'entendre ! Je reste à votre disposition pour un premier échange.', time: '09:45', me: true },
        { id: 3, sender: 'Alice Deroche', text: 'Souhaitez-vous passer un entretien visio demain à 14h ?', time: '10:00', me: false },
    ];

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden flex h-[calc(100vh-160px)]">
            {/* Contacts Sidebar */}
            <div className="w-80 border-r border-slate-50 flex flex-col hidden lg:flex">
                <div className="p-8 border-b border-slate-50">
                    <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">Messages</h3>
                    <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 border border-slate-50">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Rechercher..." className="bg-transparent border-none outline-none text-xs font-bold w-full" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="p-6 flex items-center gap-4 hover:bg-[#B76E79]/5 cursor-pointer transition-all relative group border-b border-slate-50/50">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-sm border border-slate-100 shadow-sm relative">
                                {contact.img}
                                {contact.online && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-4 border-white"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 truncate text-sm">{contact.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate italic">{contact.role}</p>
                            </div>
                            {contact.id === 1 && <span className="w-2 h-2 bg-[#B76E79] rounded-full"></span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col bg-[#FAFAFA]">
                {/* Chat Header */}
                <header className="p-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-[#B76E79]">AD</div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Alice Deroche</h4>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest italic">En ligne</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 text-slate-400 hover:text-[#B76E79] transition-colors"><Phone size={18} /></button>
                        <button className="p-3 text-slate-400 hover:text-[#B76E79] transition-colors"><Video size={18} /></button>
                        <button className="p-3 text-slate-400 hover:text-[#B76E79] transition-colors"><MoreVertical size={18} /></button>
                    </div>
                </header>

                {/* Messages Scroller */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 scroll-smooth">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.me ? 'justify-end' : 'justify-start'} group`}>
                            <div className={`max-w-[80%] md:max-w-[60%] space-y-2`}>
                                <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm relative ${
                                    msg.me ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-50'
                                }`}>
                                    {msg.text}
                                    {!msg.me && (
                                        <div className="absolute top-0 -left-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">AD</div>
                                        </div>
                                    )}
                                </div>
                                <div className={`flex items-center gap-2 px-1 ${msg.me ? 'justify-end' : 'justify-start'}`}>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{msg.time}</p>
                                    {msg.me && <CheckCheck size={12} className="text-[#B76E79]" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* IA Suggestion Bubble */}
                    <div className="flex justify-center py-4">
                         <div className="bg-gradient-to-br from-[#B76E79]/5 to-white border border-[#B76E79]/20 p-5 rounded-[2rem] max-w-lg flex items-center gap-5 shadow-inner">
                            <div className="w-10 h-10 bg-[#B76E79] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#B76E79]/20">
                                <Sparkles size={16} />
                            </div>
                            <p className="text-xs text-slate-600 font-medium italic">
                                <strong>Conseil IA :</strong> Alice semble pressée. Une réponse positive et structurée pour l'horaire de 14h maximisera vos chances d'impressionner.
                            </p>
                         </div>
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-6 lg:px-10 bg-white border-t border-slate-50">
                    <div className="flex items-center gap-4 bg-[#FAFAFA] p-2 pr-4 rounded-[2rem] border border-slate-100 focus-within:border-[#B76E79]/30 transition-all shadow-inner">
                        <button className="p-3 text-slate-400 hover:text-[#B76E79] transition-colors"><Paperclip size={20} /></button>
                        <input 
                            type="text" 
                            placeholder="Écrivez votre réponse luxueuse..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium focus:ring-0 px-2"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            className="bg-[#B76E79] text-white p-4 rounded-full hover:shadow-xl hover:shadow-[#B76E79]/30 transition-all active:scale-90 shadow-lg"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateChat;

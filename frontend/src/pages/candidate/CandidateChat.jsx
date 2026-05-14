import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Search,
  Sparkles,
  CheckCheck,
  ChevronLeft,
  User,
  Clock,
  Loader2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const CandidateChat = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConv) {
            fetchMessages(selectedConv.user._id);
        }
    }, [selectedConv]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await API.get('/messages/conversations');
            setConversations(res.data);
            setIsLoadingConv(false);
        } catch (error) {
            toast.error('Erreur lors du chargement des conversations');
            setIsLoadingConv(false);
        }
    };

    const fetchMessages = async (userId) => {
        setIsLoadingMsgs(true);
        try {
            const res = await API.get(`/messages/${userId}`);
            setMessages(res.data);
            setIsLoadingMsgs(false);
        } catch (error) {
            toast.error('Erreur lors du chargement des messages');
            setIsLoadingMsgs(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        const content = newMessage;
        setNewMessage('');

        try {
            const res = await API.post('/messages', {
                receiver: selectedConv.user._id,
                content
            });
            setMessages([...messages, res.data]);
        } catch (error) {
            toast.error('Erreur lors de l\'envoi');
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex h-[calc(100vh-160px)] relative z-10">
            {/* Contacts Sidebar */}
            <div className={`w-80 border-r border-white/5 flex flex-col ${selectedConv ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-8 border-b border-white/5 bg-slate-950/20">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Messages</h3>
                    <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-3 border border-white/5 shadow-inner group focus-within:border-blue-500/30 transition-all">
                        <Search size={16} className="text-slate-500 group-focus-within:text-blue-400" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder-slate-600 w-full" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoadingConv ? (
                        <div className="flex flex-col items-center justify-center p-12 space-y-4">
                            <Loader2 className="animate-spin text-blue-400" size={32} />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Syncing...</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-slate-500 italic">No conversations yet.</p>
                        </div>
                    ) : conversations.map((conv) => (
                        <div 
                            key={conv.user._id} 
                            onClick={() => setSelectedConv(conv)}
                            className={`p-6 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${
                                selectedConv?.user._id === conv.user._id 
                                ? 'bg-white/5 border-blue-500' 
                                : 'border-transparent hover:bg-white/[0.02]'
                            } border-b border-white/[0.02]`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm border border-white/5 shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <User size={20} />
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate text-sm">{conv.user.nom}</p>
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter truncate italic">{conv.user.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Content */}
            <div className={`flex-1 flex flex-col bg-slate-950/20 backdrop-blur-sm ${!selectedConv ? 'hidden lg:flex' : 'flex'}`}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <header className="p-6 lg:px-10 bg-slate-900/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10 shrink-0 shadow-xl">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedConv(null)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-blue-400 shadow-inner">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{selectedConv.user.nom}</h4>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest italic animate-pulse">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 text-slate-500 hover:text-white transition-colors"><Phone size={18} /></button>
                                <button className="p-3 text-slate-500 hover:text-white transition-colors"><Video size={18} /></button>
                                <button className="p-3 text-slate-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                            </div>
                        </header>

                        {/* Messages Scroller */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar">
                            {isLoadingMsgs ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <Cpu className="animate-spin text-blue-500/50" size={40} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Syncing Messages...</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <div key={msg._id} className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'} group`}>
                                            <div className={`max-w-[80%] md:max-w-[65%] space-y-2`}>
                                                <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-2xl relative transition-all hover:scale-[1.01] ${
                                                    msg.sender === currentUser.id 
                                                    ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-tr-none shadow-rose-500/10' 
                                                    : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5 backdrop-blur-xl'
                                                }`}>
                                                    {msg.text || msg.content}
                                                </div>
                                                <div className={`flex items-center gap-2 px-1 ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    {msg.sender === currentUser.id && <CheckCheck size={12} className="text-rose-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* IA Suggestion Bubble */}
                                    <div className="flex justify-center py-4">
                                         <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-6 rounded-[2rem] max-w-lg flex items-center gap-5 shadow-2xl backdrop-blur-md group hover:border-blue-500/40 transition-all">
                                            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                                                <Sparkles size={20} />
                                            </div>
                                            <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                                                <strong className="text-blue-400 font-bold uppercase tracking-widest text-[9px] block mb-1">AI Assistant Node</strong>
                                                "It seems like {selectedConv?.user.nom.split(' ')[0]} is waiting for a confirmation. A professional and concise response about your availability will increase your score."
                                            </p>
                                         </div>
                                    </div>
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-6 lg:px-10 bg-slate-900/40 backdrop-blur-3xl border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white/5 p-2 pr-4 rounded-[2rem] border border-white/5 focus-within:border-rose-500/30 transition-all shadow-inner">
                                <button type="button" className="p-3 text-slate-500 hover:text-white transition-colors"><Paperclip size={20} /></button>
                                <input 
                                    type="text" 
                                    placeholder="Type your elegant response..." 
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white placeholder-slate-600 focus:ring-0 px-2"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-4 rounded-full hover:shadow-2xl hover:shadow-rose-500/20 transition-all active:scale-90 shadow-lg disabled:opacity-30 disabled:grayscale"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center text-rose-400 shadow-2xl mb-8 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Sparkles className="w-12 h-12 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Candidate Concierge</h2>
                        <p className="text-slate-500 max-w-md text-sm font-medium italic">Your direct line to recruiters. Every message is analyzed by Smart-ATS to provide you with strategic communication tips.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateChat;

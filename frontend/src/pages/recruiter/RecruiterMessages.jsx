import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Search, 
  Send, 
  Sparkles, 
  MoreVertical, 
  ChevronLeft,
  User,
  Clock,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const RecruiterMessages = () => {
    const { user: currentUser } = useContext(AuthContext);
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
    const [isTypingAI, setIsTypingAI] = useState(false);
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
    }, [messages, isTypingAI]);

    const fetchConversations = async () => {
        try {
            const res = await API.get('/messages/conversations');
            let fetchedConvs = res.data;
            
            // Check if we navigated here to start a new chat
            if (location.state?.userId) {
                const existingConv = fetchedConvs.find(c => c.user._id === location.state.userId);
                if (existingConv) {
                    setSelectedConv(existingConv);
                } else {
                    // Create a temporary conversation object for the new chat
                    const newConv = {
                        user: { _id: location.state.userId, nom: location.state.userName, role: 'candidate' },
                        lastMessage: '',
                        lastMessageDate: new Date()
                    };
                    fetchedConvs = [newConv, ...fetchedConvs];
                    setSelectedConv(newConv);
                }
            }
            
            setConversations(fetchedConvs);
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

    const handleAISuggest = () => {
        setIsTypingAI(true);
        setTimeout(() => {
            const suggestions = [
                `Bonjour ${selectedConv?.user.nom.split(' ')[0]}, votre profil a retenu toute notre attention. Seriez-vous disponible pour un court échange ?`,
                "Félicitations ! Nous souhaitons faire progresser votre candidature vers l'étape suivante.",
                "Merci pour les précisions apportées. Nous revenons vers vous très prochainement."
            ];
            const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)];
            setNewMessage(randomSuggest);
            setIsTypingAI(false);
            toast.success('Suggestion IA générée', { icon: '✨' });
        }, 1200);
    };

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative z-10">
            
            {/* Sidebar: Liste des Conversations */}
            <div className={`w-full md:w-96 border-r border-white/5 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 border-b border-white/5 bg-slate-950/20">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-blue-400" />
                        Messages
                    </h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search talent..." 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoadingConv ? (
                        <div className="flex flex-col items-center justify-center p-12 space-y-4">
                            <Loader2 className="animate-spin text-blue-400" size={32} />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Syncing Conversations...</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-slate-500 italic">No active conversations found.</p>
                        </div>
                    ) : conversations.map((conv) => (
                        <div 
                            key={conv.user._id}
                            onClick={() => setSelectedConv(conv)}
                            className={`p-6 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${
                                selectedConv?.user._id === conv.user._id 
                                ? 'bg-white/5 border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                                : 'border-transparent hover:bg-white/[0.02]'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <User className="text-slate-400" size={24} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 bg-emerald-500"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-white truncate text-sm">{conv.user.nom}</h3>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {conv.lastMessageDate ? new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 truncate font-medium">{conv.lastMessage || 'Start a conversation...'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-slate-950/20 backdrop-blur-sm ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center justify-between z-10 shadow-xl">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedConv(null)} className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{selectedConv.user.nom}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex flex-col items-end mr-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                        <ShieldCheck size={12} className="text-blue-400" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Encrypted</span>
                                    </div>
                                </div>
                                <button className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-slate-500 hover:text-white"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {isLoadingMsgs ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <Cpu className="animate-spin text-blue-500/50" size={40} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Loading Secure Thread...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center mb-8">
                                        <span className="bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] shadow-inner">Encrypted Conversation Channel</span>
                                    </div>

                                    {messages.map((msg) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg._id} 
                                            className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[75%] p-5 rounded-[2rem] shadow-2xl relative group transition-all hover:scale-[1.01] ${
                                                msg.sender === currentUser.id 
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-500/10' 
                                                : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5 backdrop-blur-xl'
                                            }`}>
                                                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                <div className={`flex items-center gap-2 mt-2 ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                                    <Clock size={10} className="opacity-40" />
                                                    <span className={`text-[9px] font-bold uppercase tracking-tighter opacity-40`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    {isTypingAI && (
                                        <div className="flex justify-end">
                                            <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] rounded-tr-none border border-blue-500/20 flex items-center gap-3">
                                                <Loader2 size={16} className="animate-spin text-blue-400" />
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">AI Drafting Response...</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-8 bg-slate-900/40 backdrop-blur-3xl border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <button 
                                    type="button"
                                    onClick={handleAISuggest}
                                    className="shrink-0 w-14 h-14 bg-white/5 text-blue-400 border border-white/10 rounded-2xl flex items-center justify-center hover:scale-105 hover:bg-white/10 active:scale-95 transition-all shadow-xl group relative"
                                    title="AI Suggest"
                                >
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                </button>
                                
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..." 
                                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 px-8 text-sm font-medium text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 outline-none transition-all shadow-inner placeholder-slate-600"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-30 disabled:grayscale"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                            <p className="text-center text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600 mt-4">Smart-ATS Quantum Encryption • v5.0 SECURE</p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl mb-8 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <MessageSquare className="w-12 h-12 animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Strategic Messaging</h2>
                        <p className="text-slate-500 max-w-md text-sm font-medium italic">Select a talent from the sidebar to initiate a high-level conversation. AI-powered drafting is available for precision communication.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterMessages;

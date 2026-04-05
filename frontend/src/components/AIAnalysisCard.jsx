import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';

const AIAnalysisCard = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 p-16 opacity-10">
                <BrainCircuit className="w-64 h-64 transform rotate-12" />
            </div>

            <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm mb-4">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs font-medium text-blue-50">AI Engine Ready</span>
                </div>

                <h2 className="text-3xl font-bold mb-4">AI-Powered CV Analysis</h2>
                <p className="text-blue-100 mb-8 leading-relaxed">
                    Our advanced AI has processed 156 applications today, identifying 12 top-tier candidates matching your specifications with 98% accuracy.
                </p>

                <div className="flex gap-4">
                    <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg active:scale-95 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/10 hover:bg-gray-50">
                        View Analysis
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-6 py-2.5 rounded-lg border border-blue-400 hover:bg-white/10 transition-colors font-medium">
                        Configure Rules
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisCard;

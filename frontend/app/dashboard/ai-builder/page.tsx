'use client';
import { useState } from 'react';
import { Sparkles, Globe, ChevronDown, LayoutTemplate, Clock, AlertCircle } from 'lucide-react';

export default function AIBuilderPage() {
    const [url, setUrl] = useState('');
    const [language, setLanguage] = useState('English');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if (!url) return;
        setIsGenerating(true);
        // Mock loading state
        setTimeout(() => setIsGenerating(false), 3000);
    };

    return (
        <main className="p-8 min-h-screen font-sans text-gray-200 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-luxury-gold/10 rounded-lg border border-luxury-gold/20">
                        <Sparkles className="text-luxury-gold" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create your Store with AI</h1>
                </div>

                {/* Generation Credits (Mock) */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-bold text-gray-300">0/1 Generated</span>
                </div>
            </div>

            {/* Main Generation Card */}
            <div className="w-full max-w-3xl mt-12 flex flex-col items-center text-center">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4 tracking-tight">
                    Create your shop in seconds with <span className="text-luxury-gold">Zelvyra AI</span>
                </h2>
                <p className="text-gray-500 mb-10 text-lg max-w-xl">
                    Turn your product link into a high converting shopify store. Paste your <span className="text-white font-bold">AliExpress</span> or <span className="text-white font-bold">Amazon</span> link below, generate and customize.
                </p>

                {/* Input Control Group */}
                <div className="w-full flex gap-3 mb-6 relative z-10">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            placeholder="AliExpress, Alibaba, or Amazon product URL..."
                            className="w-full h-14 bg-black/40 border border-white/20 rounded-xl pl-6 pr-6 outline-none text-white focus:border-luxury-gold shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] transition-all"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* Language Selector */}
                    <div className="relative w-40">
                        <div className="w-full h-14 bg-black/40 border border-white/20 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-white/40 transition-all text-white font-medium">
                            <span className="flex items-center gap-2 text-sm">
                                <Globe size={16} className="text-gray-400" />
                                {language}
                            </span>
                            <ChevronDown size={16} className="text-gray-500" />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                Building...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} fill="currentColor" />
                                Generate
                            </>
                        )}
                    </button>
                </div>

                <a href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors mb-20">
                    <LayoutTemplate size={16} />
                    Add a product page to your existing theme
                </a>
            </div>

            {/* History Table */}
            <div className="w-full max-w-5xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-gray-500" />
                    History
                </h3>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md min-h-[300px] flex flex-col">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 p-4 border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest font-bold">
                        <div className="col-span-2">Product</div>
                        <div>Language</div>
                        <div>Type</div>
                        <div className="text-right">Action</div>
                    </div>

                    {/* Empty State */}
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-500">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <AlertCircle size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium">No theme generated yet.</p>
                        <p className="text-xs mt-2 opacity-50">Enter a URL above to start building.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

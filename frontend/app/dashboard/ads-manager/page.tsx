'use client';
import { useState, useRef } from 'react';
import { Layout, PenTool, Download, Upload, Wand2, Copy, Check, MessageSquare, Zap, Image as ImageIcon, Loader2 } from 'lucide-react';

type AdCopy = {
    hook: string;
    body: string;
    cta: string;
    hashtags: string;
};

export default function AdsManagerPage() {
    const [activeTab, setActiveTab] = useState<'creative' | 'copy'>('creative');

    // Creative State
    const [creativeFile, setCreativeFile] = useState<File | null>(null);
    const [creativePreview, setCreativePreview] = useState<string | null>(null);
    const [generatedCreative, setGeneratedCreative] = useState<string | null>(null);
    const [template, setTemplate] = useState<'Sale' | 'Lifestyle' | 'Minimal'>('Sale');
    const [generatingCreative, setGeneratingCreative] = useState(false);

    // Copy State
    const [productName, setProductName] = useState('');
    const [storeVibe, setStoreVibe] = useState('Fun');
    const [generatedCopy, setGeneratedCopy] = useState<AdCopy | null>(null);
    const [generatingCopy, setGeneratingCopy] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- HANDLERS ---

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCreativeFile(file);
            setCreativePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerateCreative = async () => {
        if (!creativePreview) return;
        setGeneratingCreative(true);
        setGeneratedCreative(null);

        try {
            // Simulate Upload to Backend (Passing preview URL as placeholder for now)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/ads-gen/creative`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: "placeholder",
                    template: template,
                    text_overlay: "Special Offer"
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setGeneratedCreative(data.creative_url);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate creative");
        } finally {
            setGeneratingCreative(false);
        }
    };

    const handleGenerateCopy = async () => {
        if (!productName) return;
        setGeneratingCopy(true);
        setGeneratedCopy(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/ads-gen/copy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    store_vibe: storeVibe,
                    target_audience: "General"
                })
            });
            const data = await res.json();
            setGeneratedCopy(data);
        } catch (e) {
            console.error(e);
            alert("Failed to generate copy");
        } finally {
            setGeneratingCopy(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="min-h-screen bg-deep-obsidian p-8 font-sans text-gray-200">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Zap className="text-luxury-gold" /> AI Ads Manager
            </h1>

            {/* TABS */}
            <div className="flex border-b border-white/10 mb-8 max-w-4xl mx-auto">
                <button
                    onClick={() => setActiveTab('creative')}
                    className={`flex-1 pb-4 text-center font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'creative' ? 'text-white border-b-2 border-luxury-gold' : 'text-gray-500 hover:text-white'}`}
                >
                    <Layout size={18} /> Creative Studio
                </button>
                <button
                    onClick={() => setActiveTab('copy')}
                    className={`flex-1 pb-4 text-center font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'copy' ? 'text-white border-b-2 border-luxury-gold' : 'text-gray-500 hover:text-white'}`}
                >
                    <PenTool size={18} /> Ad Copywriter
                </button>
            </div>

            <div className="max-w-6xl mx-auto">
                {activeTab === 'creative' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT: Controls */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Upload size={20} className="text-luxury-gold" /> Upload Asset
                            </h2>

                            {/* Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer mb-8 relative overflow-hidden group"
                            >
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

                                {creativePreview ? (
                                    <div className="relative z-10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={creativePreview} alt="Preview" className="h-48 mx-auto object-contain rounded-lg shadow-lg" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                            <p className="text-white font-bold text-xs">Change Image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <ImageIcon className="text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-300 font-bold">Click to Upload Product Image</p>
                                    </>
                                )}
                            </div>

                            {/* Template Selector */}
                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Select Template Style</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['Sale', 'Lifestyle', 'Minimal'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTemplate(t)}
                                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${template === t
                                                ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-yellow-500/20'
                                                : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateCreative}
                                disabled={!creativePreview || generatingCreative}
                                className="w-full bg-education-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {generatingCreative ? (
                                    <><Loader2 className="animate-spin" /> Designing Ad...</>
                                ) : (
                                    <><Wand2 size={18} /> Generate Creative</>
                                )}
                            </button>
                        </div>

                        {/* RIGHT: Result */}
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px] relative">
                            {generatedCreative ? (
                                <div className="animate-in fade-in zoom-in duration-500 relative w-full h-full flex flex-col items-center">
                                    <h3 className="text-white font-bold mb-4 absolute top-0 left-0 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm text-xs">Generated {template} Ad</h3>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={generatedCreative} alt="Generated Ad" className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-2xl border border-white/10 mb-6" />

                                    <div className="flex gap-4 w-full max-w-xs">
                                        <button className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                                            <Download size={18} /> Download
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <Layout size={32} className="opacity-50" />
                                    </div>
                                    <p className="text-sm">Select an image and template to generate your ad.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // COPYWRITER TAB
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <MessageSquare size={20} className="text-luxury-gold" /> Ad Details
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Store Vibe</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Professional', 'Fun', 'Luxury', 'Urgent'].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => setStoreVibe(v)}
                                                className={`py-3 rounded-xl text-xs font-bold border transition-all ${storeVibe === v
                                                    ? 'bg-white/10 text-luxury-gold border-luxury-gold'
                                                    : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerateCopy}
                                    disabled={!productName || generatingCopy}
                                    className="w-full bg-education-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {generatingCopy ? (
                                        <><Loader2 className="animate-spin" /> Writing Copy...</>
                                    ) : (
                                        <><Wand2 size={18} /> Generate Copy</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Output */}
                        <div className="space-y-4">
                            {generatedCopy ? (
                                <>
                                    {/* Hook */}
                                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group">
                                        <label className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider mb-2 block">Hook / Headline</label>
                                        <p className="text-white text-lg font-medium leading-relaxed">{generatedCopy.hook}</p>
                                        <button
                                            onClick={() => copyToClipboard(generatedCopy.hook, 'hook')}
                                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {copiedField === 'hook' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group">
                                        <label className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider mb-2 block">Primary Text</label>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{generatedCopy.body}</p>
                                        <div className="mt-3">
                                            <p className="text-blue-400 text-xs">{generatedCopy.hashtags}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(generatedCopy.body + '\n\n' + generatedCopy.hashtags, 'body')}
                                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {copiedField === 'body' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                        </button>
                                    </div>

                                    {/* CTA */}
                                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group flex items-center justify-between">
                                        <div>
                                            <label className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider mb-1 block">Call to Action</label>
                                            <p className="text-white font-bold">{generatedCopy.cta}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(generatedCopy.cta, 'cta')}
                                            className="text-gray-500 hover:text-white transition-colors"
                                        >
                                            {copiedField === 'cta' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-gray-500">
                                    <PenTool size={32} className="mb-4 opacity-50" />
                                    <p>Enter product details to generate high-converting ad copy.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

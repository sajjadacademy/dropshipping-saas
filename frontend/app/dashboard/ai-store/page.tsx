'use client';
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Upload, Wand2, ArrowLeft } from 'lucide-react';

// Steps Enum
type Step = 'scan' | 'identity' | 'customize' | 'preview';

export default function AIStoreWizard() {
    const [step, setStep] = useState<Step>('scan');

    // Step 1: Scan
    const [productUrl, setProductUrl] = useState('');
    const [language, setLanguage] = useState('en');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scannedData, setScannedData] = useState<any>(null);

    // Step 2: Identity
    const [storeName, setStoreName] = useState('');
    const [storeImage, setStoreImage] = useState<string | null>(null);

    // Handlers
    const handleScan = async () => {
        if (!productUrl) return alert("Please enter a URL");

        setIsScanning(true);
        setScanProgress(0);

        // Mock Progress
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 300);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/store-ai/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: productUrl, language })
            });
            const json = await res.json();

            clearInterval(interval);
            setScanProgress(100);

            setTimeout(() => {
                if (json.status === 'success') {
                    setScannedData(json.data);
                    setStoreName(json.data.title + " Store"); // Default suggested name
                    setStep('identity');
                } else {
                    alert("Scan failed: " + json.data.message);
                }
                setIsScanning(false);
            }, 500);

        } catch (e) {
            clearInterval(interval);
            setIsScanning(false);
            alert("Error connecting to server");
        }
    };

    return (
        <div className="min-h-screen bg-deep-obsidian p-8 font-sans text-gray-200">
            {/* Wizard Header */}
            <div className="max-w-4xl mx-auto mb-12">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <Wand2 className="text-luxury-gold" /> AI Store Generator
                </h1>
                <p className="text-gray-400 text-sm">Turn any product URL into a high-converting Shopify store in minutes.</p>

                {/* Progress Indicators */}
                <div className="flex items-center gap-4 mt-8">
                    {['Scan', 'Identity', 'Customize', 'Preview'].map((s, i) => {
                        const currentStepIndex = ['scan', 'identity', 'customize', 'preview'].indexOf(step);
                        const isActive = i <= currentStepIndex;
                        return (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isActive ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                    {i + 1}
                                </div>
                                <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-600'}`}>{s}</span>
                                {i < 3 && <div className="w-8 h-px bg-gray-800 mx-2"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto">

                {/* STEP 1: SCAN */}
                {step === 'scan' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="text-luxury-gold" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Start with a Product</h2>
                            <p className="text-gray-400">Paste a link from AliExpress, Amazon, or Alibaba.</p>
                        </div>

                        <div className="max-w-xl mx-auto space-y-6">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Product URL</label>
                                <input
                                    type="text"
                                    placeholder="https://aliexpress.com/item/..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold transition-colors"
                                    value={productUrl}
                                    onChange={(e) => setProductUrl(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Store Language</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold transition-colors appearance-none"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="en">English (Default)</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>

                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className="w-full bg-education-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isScanning ? 'Processing...' : 'Generate Store Concept'}
                                {!isScanning && <ArrowRight size={20} />}
                            </button>
                        </div>

                        {/* Processing Bar Overlay */}
                        {isScanning && (
                            <div className="mt-8 max-w-xl mx-auto">
                                <div className="flex justify-between text-xs text-luxury-gold mb-2 font-bold uppercase">
                                    <span>Generating Your Shop...</span>
                                    <span>{scanProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-luxury-gold transition-all duration-300 ease-out"
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-center text-xs text-gray-500 mt-4 animate-pulse">
                                    Analyzing product features, market fit, and design aesthetics...
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: IDENTITY */}
                {step === 'identity' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-10 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Store Identity</h2>
                            <div className="text-xs text-gray-500">Step 2 of 4</div>
                        </div>

                        <div className="space-y-8">
                            {/* Store Name */}
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Store Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold transition-colors text-lg font-bold"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    placeholder="My Awesome Store"
                                />
                            </div>

                            {/* Image Selection */}
                            <div>
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-4">Product Photography</label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Option A: Upload */}
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${storeImage && !storeImage.startsWith('http') ? 'border-luxury-gold bg-luxury-gold/5' : 'border-white/10 hover:border-white/30'}`}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <Upload className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-300 font-bold">Upload from Desktop</span>
                                        <input type="file" id="file-upload" className="hidden" onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                const url = URL.createObjectURL(e.target.files[0]);
                                                setStoreImage(url);
                                            }
                                        }} />
                                    </div>

                                    {/* Option B: AI Generate */}
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${storeImage && storeImage.startsWith('http') ? 'border-luxury-gold bg-luxury-gold/5' : 'border-white/10 hover:border-white/30'}`}
                                        onClick={async () => {
                                            if (!scannedData?.title) return;
                                            setIsScanning(true); // Reuse loading state
                                            try {
                                                const res = await fetch('http://127.0.0.1:8000/api/store-ai/generate-images', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ prompt: scannedData.title })
                                                });
                                                const data = await res.json();
                                                if (data.status === 'success' && data.images.length > 0) {
                                                    setStoreImage(data.images[0]); // Auto-select first
                                                }
                                            } catch (e) {
                                                alert("AI Generation Failed");
                                            } finally {
                                                setIsScanning(false);
                                            }
                                        }}
                                    >
                                        <Wand2 className="text-luxury-gold mb-2" />
                                        <span className="text-sm text-gray-300 font-bold">Generate with AI</span>
                                        {isScanning && <span className="text-xs text-luxury-gold animate-pulse mt-1">Generating...</span>}
                                    </div>
                                </div>

                                {/* Selected Image Preview */}
                                {storeImage && (
                                    <div className="mt-6">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Selected Asset</div>
                                        <div className="w-full h-64 bg-black rounded-xl overflow-hidden border border-white/10 relative group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={storeImage} alt="Selected" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-bold text-sm">Main Product Image</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => setStep('scan')}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep('customize')}
                                    disabled={!storeName || !storeImage}
                                    className="flex-1 bg-luxury-gold hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next (Customize)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: CUSTOMIZE */}
                {step === 'customize' && (
                    <CustomizeStep
                        setStep={setStep}
                        storeName={storeName}
                        scannedData={scannedData}
                        onSave={(data: any) => {
                            // Save to global state if needed, for now just pass to preview
                            console.log("Saved Config:", data);
                            setStep('preview');
                        }}
                    />
                )}

                {/* STEP 4: PREVIEW & DEPLOY */}
                {step === 'preview' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Preview & Launch</h2>
                                <p className="text-xs text-gray-500">Step 4 of 4</p>
                            </div>
                            <button
                                onClick={() => setStep('customize')}
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                            >
                                <ArrowLeft size={14} /> Back to Editor
                            </button>
                        </div>

                        {/* LIVE PREVIEW FRAME */}
                        <div className="w-full bg-white rounded-xl overflow-hidden shadow-2xl mb-8 border border-white/20">
                            {/* Mock Browser Header */}
                            <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex-1 bg-white rounded text-[10px] text-gray-500 text-center py-1 mx-4 font-mono">
                                    {storeName.toLowerCase().replace(/\s/g, '') || 'mystore'}.com
                                </div>
                            </div>

                            {/* THE CONTENT */}
                            <div className="text-black min-h-[400px]" style={{ fontFamily: 'sans-serif' }}>
                                {/* Navbar */}
                                <div className="p-4 flex justify-between items-center" style={{ backgroundColor: scannedData?.colors?.background || '#fff' }}>
                                    <div className="font-bold text-lg" style={{ color: scannedData?.colors?.primary }}>{storeName}</div>
                                    <div className="text-xs font-bold uppercase tracking-wider">Shop Now</div>
                                </div>

                                {/* Hero */}
                                <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {storeImage && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={storeImage} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="hero" />
                                    )}
                                    <div className="relative z-10 text-center p-6 bg-white/90 backdrop-blur-sm rounded-lg max-w-sm m-4">
                                        <h1 className="text-2xl font-bold mb-2" style={{ color: scannedData?.colors?.primary || '#000' }}>
                                            {scannedData?.title || 'Product Title'}
                                        </h1>
                                        <button className="px-6 py-2 rounded-full text-sm font-bold shadow-lg transform hover:-translate-y-1 transition-transform"
                                            style={{ backgroundColor: scannedData?.colors?.accent || '#000', color: '#fff' }}
                                        >
                                            Shop Now - $49.99
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DEPLOY ACTIONS */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <RocketIcon /> Deploy to Shopify
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Option 1: Connect API */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs">
                                        <strong>Recommended:</strong> Auto-push products, theme, and settings directly via API.
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="myshop.myshopify.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm outline-none"
                                        id="shopify-domain"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Admin Access Token (shpat_...)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm outline-none"
                                        id="shopify-token"
                                    />
                                    <button
                                        onClick={async () => {
                                            const domain = (document.getElementById('shopify-domain') as HTMLInputElement).value;
                                            const token = (document.getElementById('shopify-token') as HTMLInputElement).value;
                                            if (!domain || !token) return alert("Please enter credentials");

                                            const btn = document.getElementById('deploy-btn');
                                            if (btn) btn.innerText = "Deploying...";

                                            try {
                                                const res = await fetch('http://127.0.0.1:8000/api/store-ai/deploy', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        store_name: storeName,
                                                        shopify_domain: domain,
                                                        access_token: token,
                                                        config: { scannedData, storeImage } // Pass context
                                                    })
                                                });
                                                const json = await res.json();
                                                alert(json.message);
                                                if (btn) btn.innerText = "Connect & Push Store";
                                            } catch (e) {
                                                alert("Connection Failed");
                                                if (btn) btn.innerText = "Connect & Push Store";
                                            }
                                        }}
                                        id="deploy-btn"
                                        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        Connect & Push Store
                                    </button>
                                </div>

                                {/* Option 2: Download */}
                                <div className="space-y-4 border-l border-white/10 pl-8 flex flex-col justify-center">
                                    <div className="text-sm text-gray-400 mb-2">Or handle it manually:</div>
                                    <button
                                        onClick={() => window.open('http://127.0.0.1:8000/api/store-ai/download', '_blank')}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <DownloadIcon /> Download Theme (.zip)
                                    </button>
                                    <p className="text-[10px] text-gray-500 text-center mt-2">Includes JSON templates + Assets</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

function CustomizeStep({ setStep, storeName, scannedData, onSave }: any) {
    const [activeTab, setActiveTab] = useState('product');
    const [palette, setPalette] = useState<any>(null);
    const [loadingPalette, setLoadingPalette] = useState(false);

    // Form State (Simplified for Demo)
    const [formData, setFormData] = useState({
        whyUs: "Free Shipping & 30-Day Returns",
        clinical: "Dermatologist Tested & Approved",
        reviews: "Rated 4.9/5 by 10,000+ Customers",
        faq: "How long is shipping? 3-5 Business Days.",
        landingMain: "Welcome to " + storeName,
        landingSpecial: "Limited Time Offer: 50% OFF",
        font: "Inter",
        colors: { primary: "#000000", secondary: "#FFFFFF", accent: "#FFD700" }
    });

    const handlePaletteGen = async () => {
        setLoadingPalette(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/store-ai/generate-palette', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: "Luxury generic store" })
            });
            const json = await res.json();
            if (json.status === 'success') {
                setPalette(json.palette);
                setFormData(prev => ({ ...prev, colors: json.palette }));
            }
        } catch (e) {
            alert("Palette Gen Failed");
        } finally {
            setLoadingPalette(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Customize Store</h2>
                <div className="text-xs text-gray-500">Step 3 of 4</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-1">
                {['product', 'home', 'styles'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-luxury-gold border-b-2 border-luxury-gold' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab === 'product' ? 'Product Page' : tab === 'home' ? 'Home Page' : 'Styles'}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {activeTab === 'product' && (
                    <div className="space-y-4 animate-in fade-in">
                        <InputGroup label="Why Us Section" value={formData.whyUs} onChange={(v: string) => setFormData({ ...formData, whyUs: v })} />
                        <InputGroup label="Clinical / Trust Badge" value={formData.clinical} onChange={(v: string) => setFormData({ ...formData, clinical: v })} />
                        <InputGroup label="Reviews Headline" value={formData.reviews} onChange={(v: string) => setFormData({ ...formData, reviews: v })} />
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase font-bold">FAQs (One per line)</label>
                            <textarea
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-luxury-gold h-24"
                                value={formData.faq}
                                onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'home' && (
                    <div className="space-y-4 animate-in fade-in">
                        <InputGroup label="Landing Page Main Headline" value={formData.landingMain} onChange={(v: string) => setFormData({ ...formData, landingMain: v })} />
                        <InputGroup label="Special Offer Section" value={formData.landingSpecial} onChange={(v: string) => setFormData({ ...formData, landingSpecial: v })} />
                    </div>
                )}

                {activeTab === 'styles' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Font Family</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold"
                                value={formData.font}
                                onChange={(e) => setFormData({ ...formData, font: e.target.value })}
                            >
                                <option value="Inter">Inter (Clean)</option>
                                <option value="Playfair Display">Playfair (Luxury)</option>
                                <option value="Roboto">Roboto (Tech)</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Brand Colors</label>
                                <button
                                    onClick={handlePaletteGen}
                                    disabled={loadingPalette}
                                    className="text-[10px] bg-luxury-gold/10 text-luxury-gold px-2 py-1 rounded border border-luxury-gold/20 flex items-center gap-1 hover:bg-luxury-gold/20"
                                >
                                    <Wand2 size={10} /> {loadingPalette ? 'Generating...' : 'Generate Palette'}
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {Object.entries(formData.colors).map(([key, val]) => (
                                    <div key={key} className="space-y-1">
                                        <div className="h-10 rounded-lg border border-white/10 shadow-sm" style={{ backgroundColor: val as string }}></div>
                                        <div className="text-[10px] text-gray-500 capitalize text-center">{key}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav */}
            <div className="flex gap-4 pt-6 border-t border-white/5 mt-8">
                <button
                    onClick={() => setStep('identity')}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={() => onSave(formData)}
                    className="flex-1 bg-luxury-gold hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors"
                >
                    Next (Update Theme)
                </button>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange }: any) {
    return (
        <div>
            <label className="block text-xs text-gray-500 uppercase font-bold mb-2">{label}</label>
            <input
                type="text"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold transition-colors"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

// Simple Icons for this page specifically
function RocketIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
}
function DownloadIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
}

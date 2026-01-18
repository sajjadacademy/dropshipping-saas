'use client';
import { useState, useRef } from 'react';
import { Search, Upload, Link, X, ExternalLink, Star, ArrowRight } from 'lucide-react';

export default function ProductSearchPage() {
    const [activeTab, setActiveTab] = useState<'link' | 'image'>('link');
    const [source, setSource] = useState<'AliExpress' | 'Alibaba' | 'Both'>('AliExpress');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    // File Upload Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- HANDLERS ---

    // 1. Image Upload
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview locally
        const url = URL.createObjectURL(file);
        setPreviewImage(url);
        setShowPopup(true); // Show confirmation popup

        // Upload to backend (to get static URL if needed, but here we just need to confirm)
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/search/upload`, {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            // We could store json.url if we want to confirm the uploaded asset
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    // 2. Search Execution
    const executeSearch = async () => {
        setLoading(true);
        setResults([]); // Clear previous

        try {
            let endpoint = '';
            let body: any = {};

            if (activeTab === 'image') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/search/image`;
                const formData = new FormData();
                formData.append('image_url', previewImage || ''); // In real app, pass the backend URL or Base64
                formData.append('source', source);

                // For demo we use Form, but normally json
                const res = await fetch(endpoint, { method: 'POST', body: formData });
                const json = await res.json();
                if (json.results) setResults(json.results);

            } else {
                // Link Search
                endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/search/link`;
                // First get image from link
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: inputValue })
                });
                const json = await res.json();

                if (json.status === 'success' && json.image_url) {
                    setPreviewImage(json.image_url);
                    setShowPopup(true); // Show popup to confirm the scraped image
                    setLoading(false);
                    return; // Stop here, user must click "Search" in popup
                } else {
                    alert("Could not find product image in link");
                }
            }

        } catch (err) {
            alert("Search Failed");
        } finally {
            setLoading(false);
        }
    };

    // 3. Confirm Search from Popup
    const handlePopupSearch = async () => {
        setLoading(true);
        setShowPopup(false);

        try {
            // We treat this as an "Image Search" now since we have the image (either uploaded or scraped)
            const formData = new FormData();
            formData.append('image_url', previewImage || '');
            formData.append('source', source);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/search/image`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                alert(`Search Failed: Server responded with ${res.status} - ${errorText}`);
                setLoading(false);
                return;
            }

            const json = await res.json();
            if (json.results) {
                setResults(json.results);
            } else {
                alert("No results found.");
            }

        } catch (e: any) {
            console.error("Search Error:", e);
            alert(`Search Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-obsidian p-8 font-sans text-gray-200">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Search className="text-luxury-gold" /> Product Search Engine
            </h1>

            {/* SEARCH PANEL */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">

                {/* Source Selection */}
                <div className="flex gap-4 mb-6 justify-center">
                    {(['AliExpress', 'Alibaba', 'Both'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setSource(s)}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${source === s ? 'bg-luxury-gold text-black shadow-lg shadow-yellow-500/20' : 'bg-black/40 text-gray-400 hover:text-white'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('link')}
                        className={`flex-1 pb-4 text-center font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'link' ? 'text-white border-b-2 border-luxury-gold' : 'text-gray-500'}`}
                    >
                        <Link size={16} /> Paste Link
                    </button>
                    <button
                        onClick={() => setActiveTab('image')}
                        className={`flex-1 pb-4 text-center font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'image' ? 'text-white border-b-2 border-luxury-gold' : 'text-gray-500'}`}
                    >
                        <Upload size={16} /> Upload Image
                    </button>
                </div>

                {/* Input Area */}
                <div className="relative">
                    {activeTab === 'link' ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Paste Shopify or Competitor product link..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-luxury-gold"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                onClick={executeSearch}
                                disabled={loading || !inputValue}
                                className="bg-education-blue hover:bg-blue-600 px-8 rounded-xl font-bold text-white disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Find Product'}
                            </button>
                        </div>
                    ) : (
                        <div
                            className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-white font-bold mb-1">Click to Upload or Drag Image</h3>
                            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RESULTS TABLE */}
            {results.length > 0 && (
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8">
                    <h2 className="text-xl font-bold text-white mb-4">Search Results ({results.length})</h2>
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-xs text-gray-400 uppercase border-b border-white/10">
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Sales/MOQ</th>
                                    <th className="p-4">Rating</th>
                                    <th className="p-4">Source</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {results.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="font-bold text-sm text-white line-clamp-2 max-w-[200px]">{item.title}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-luxury-gold">{item.price}</td>
                                        <td className="p-4 text-sm text-gray-400">
                                            <div>{item.sales || '-'}</div>
                                            <div className="text-[10px] text-gray-500">{item.moq}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-yellow-500 text-sm">
                                                <Star size={12} fill="currentColor" className="mr-1" />
                                                {item.rating}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${item.source === 'AliExpress' ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-orange-500/30 text-orange-500 bg-orange-500/10'}`}>
                                                {item.source}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                                            >
                                                View <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* POPUP CONFIRMATION */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-white">Confirm Search Image</h3>
                            <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 text-center">
                            <div className="w-48 h-48 mx-auto bg-black rounded-lg overflow-hidden border-2 border-luxury-gold mb-6 relative">
                                {previewImage && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                We will search for similar products on <strong>{source}</strong> using this image.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePopupSearch}
                                    className="flex-1 bg-luxury-gold hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Searching...' : 'Search Now'}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

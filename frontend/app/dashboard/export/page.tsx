'use client';
import { useState } from 'react';
import { Download, Globe, ChevronDown, RefreshCw, Archive, CheckCircle, ExternalLink, FileText, ToggleLeft } from 'lucide-react';

interface ExportHistory {
    id: number;
    shop_name: string;
    shop_url: string;
    logo_initial: string;
    logo_bg: string;
    language_code: 'us' | 'fr' | 'es';
    date: string;
    status: 'Test version' | 'Full version';
}

const MOCK_HISTORY: ExportHistory[] = [
    { id: 1, shop_name: 'wearfelicity', shop_url: 'www.wearfelicity.com', logo_initial: 'wf', logo_bg: 'bg-white text-black', language_code: 'us', date: 'Just now', status: 'Test version' },
    { id: 2, shop_name: 'omniloaded', shop_url: 'www.omniloaded.com', logo_initial: 'ol', logo_bg: 'bg-gray-200 text-gray-800', language_code: 'fr', date: '2 hours ago', status: 'Test version' },
    { id: 3, shop_name: 'trybeautie', shop_url: 'www.trybeautie.com', logo_initial: 'S', logo_bg: 'bg-green-500 text-white', language_code: 'es', date: '1 day ago', status: 'Test version' },
];

export default function ProductExportPage() {
    const [url, setUrl] = useState('');
    const [bulkExport, setBulkExport] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        if (!url) return;
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 2000);
    };

    return (
        <main className="p-8 min-h-screen font-sans text-gray-200 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-luxury-gold/10 rounded-lg border border-luxury-gold/20">
                        <FileText className="text-luxury-gold" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Product Exports</h1>
                        <p className="text-gray-500 text-xs">Effortlessly export product data to modify and simplify your workflow.</p>
                    </div>
                </div>
            </div>

            {/* Main Export Card */}
            <div className="w-full max-w-4xl mt-8 flex flex-col items-center text-center">
                <h2 className="text-3xl font-black text-white mb-4">
                    Export products from any store
                </h2>
                <p className="text-gray-500 mb-10">
                    Download product details from a <span className="text-green-400 font-bold">Shopify</span> or <span className="text-orange-400 font-bold">AliExpress</span> link<br />
                    (images, title, descriptions) in .csv
                </p>

                {/* Input Control Group */}
                <div className="w-full flex gap-3 mb-4 relative z-10">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="www.exampleboutique.com/products/minimal-sports-bra"
                            className="w-full h-12 bg-black/40 border border-white/20 rounded-lg pl-6 pr-6 outline-none text-white focus:border-luxury-gold shadow-inner transition-all text-sm font-mono"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* Language Selector */}
                    <div className="relative w-48">
                        <button className="w-full h-12 bg-black/40 border border-white/20 rounded-lg px-4 flex items-center justify-between hover:border-white/40 transition-all text-gray-300 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <Globe size={14} />
                                No Translation
                            </span>
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isExporting ? <RefreshCw size={16} className="animate-spin" /> : 'Export'}
                    </button>

                    {/* Progress Circle (Mock) */}
                    <div className="flex items-center gap-2 px-3">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="20" cy="20" r="16" stroke="gray" strokeWidth="3" fill="transparent" className="opacity-20" />
                                <circle cx="20" cy="20" r="16" stroke="#3b82f6" strokeWidth="3" fill="transparent" strokeDasharray="100" strokeDashoffset="100" />
                            </svg>
                        </div>
                        <div className="text-[10px] text-left leading-tight">
                            <div className="font-bold text-white">0/1</div>
                            <div className="text-gray-500">Exported products</div>
                        </div>
                    </div>
                </div>

                {/* Toggle */}
                <div className="w-full flex items-start gap-3 pl-2 mb-16">
                    <button onClick={() => setBulkExport(!bulkExport)} className={`text-2xl ${bulkExport ? 'text-green-500' : 'text-gray-600'} transition-colors`}>
                        <ToggleLeft size={36} className={bulkExport ? "rotate-180" : ""} />
                    </button>
                    <div className="text-left">
                        <div className="text-sm font-bold text-gray-300">Export many products</div>
                        <div className="text-xs text-gray-600">You will be able to select products you want.</div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="w-full max-w-4xl">
                <h3 className="text-lg font-bold text-white mb-6">Export History</h3>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 p-4 border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest font-bold bg-black/20">
                        <div className="col-span-2">Shop</div>
                        <div className="text-center">Language</div>
                        <div className="text-center">Date added</div>
                        {/* Action column implicit */}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/5">
                        {MOCK_HISTORY.map((item) => (
                            <div key={item.id} className="grid grid-cols-4 items-center p-4 hover:bg-white/5 transition-colors group">
                                {/* Shop Info */}
                                <div className="col-span-2 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shadow-lg ${item.logo_bg}`}>
                                        {item.logo_initial}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.shop_name}</h4>
                                        <a href={`https://${item.shop_url}`} target="_blank" className="text-xs text-blue-400 hover:underline">{item.shop_url}</a>
                                        <div className="mt-1 inline-block px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-bold rounded uppercase">Example</div>
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="flex justify-center">
                                    {item.language_code === 'us' && <span className="text-xl">🇺🇸</span>}
                                    {item.language_code === 'fr' && <span className="text-xl">🇫🇷</span>}
                                    {item.language_code === 'es' && <span className="text-xl">🇪🇸</span>}
                                </div>

                                {/* Date & Action */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-xs text-gray-500">{item.date}</div>

                                    <div className="flex items-center gap-2">
                                        <button className="p-2 border border-white/10 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                                            <Download size={14} />
                                        </button>
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-green-400 flex items-center gap-2 transition-colors">
                                            <Archive size={14} />
                                            Update Theme
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

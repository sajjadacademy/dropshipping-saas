'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ArrowUpRight, TrendingUp, BarChart2, ShoppingBag } from 'lucide-react';

interface MarketShare {
    country: string;
    percent: number;
}

interface SalesEstimates {
    daily_revenue: number;
    monthly_revenue: number;
    traffic_daily: number;
}

interface Product {
    title: string;
    price: number;
    image: string;
    handle: string;
}

interface ScanData {
    url: string;
    title: string;
    currency: string;
    language: string;
    count: number;
    avg_price: number;
    active_ads: number;
    estimates: SalesEstimates;
    market_share: MarketShare[];
    products: Product[];
    error: string | null;
}

function AnalysisContent() {
    const searchParams = useSearchParams();
    const urlParam = searchParams.get('url');

    const [url, setUrl] = useState(urlParam || '');
    const [scanResult, setScanResult] = useState<ScanData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [displayCurrency, setDisplayCurrency] = useState('USD');
    const [exchangeRate, setExchangeRate] = useState(1);

    useEffect(() => {
        if (urlParam) {
            handleAnalyze(urlParam);
        }
    }, [urlParam]);

    const handleAnalyze = async (searchUrl: string) => {
        if (!searchUrl) return;
        setLoading(true);
        setError('');
        setScanResult(null);

        try {
            const res = await fetch('http://localhost:8000/api/analysis/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: searchUrl })
            });
            const json = await res.json();
            if (json.status === 'success') {
                setScanResult(json.data);
            } else {
                throw new Error('Analysis failed');
            }
        } catch (e) {
            setError('Could not analyze store. Ensure it is accessible.');
        } finally {
            setLoading(false);
        }
    };

    const handleCurrencyChange = (curr: string) => {
        setDisplayCurrency(curr);
        const rates: Record<string, number> = { 'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'CAD': 1.35 };
        setExchangeRate(rates[curr] || 1);
    };

    return (
        <div className="p-8 min-h-screen font-sans text-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BarChart2 className="text-luxury-gold" size={24} />
                        Real-Time Shop Analysis
                    </h1>
                    <p className="text-gray-500 text-xs mt-1">Live Intelligence from APIs (No Database/Dummy Data)</p>
                </div>
                {/* Search Bar */}
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            type="text"
                            placeholder="Enter Shopify URL..."
                            className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-luxury-gold w-80 font-mono"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(url)}
                        />
                    </div>
                    <button
                        onClick={() => handleAnalyze(url)}
                        disabled={loading}
                        className="bg-luxury-gold hover:bg-yellow-600 text-black text-xs font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/10 disabled:opacity-50"
                    >
                        {loading ? <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div> : 'Analyze'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6 text-center">
                    {error}
                </div>
            )}

            {/* RESULTS TABLE */}
            {scanResult && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">

                    {/* The "List/Table" View */}
                    <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                    <th className="p-4 font-bold">Store Name</th>
                                    <th className="p-4 font-bold">Market Share</th>
                                    <th className="p-4 font-bold">Daily Sales (Est.)</th>
                                    <th className="p-4 font-bold">Monthly Sales (Est.)</th>
                                    <th className="p-4 font-bold">Active Ads</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-white/5 transition-colors">
                                    {/* Store Name */}
                                    <td className="p-4 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded p-1 shadow-sm">
                                                {/* Placeholder Icon if none */}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain=${scanResult.url}&sz=64`}
                                                    alt="icon"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">{scanResult.title}</div>
                                                <a href={scanResult.url} target="_blank" className="text-blue-400 text-xs hover:underline flex items-center gap-1">
                                                    {scanResult.url.replace('https://', '')} <ArrowUpRight size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Market Share */}
                                    <td className="p-4 border-b border-white/5">
                                        <div className="flex flex-col gap-1">
                                            {scanResult.market_share.map((m, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                                    <span className="text-base">{m.country === 'US' ? '🇺🇸' : m.country === 'GB' ? '🇬🇧' : m.country === 'CA' ? '🇨🇦' : m.country === 'DE' ? '🇩🇪' : '🌍'}</span>
                                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-luxury-gold" style={{ width: `${m.percent}%` }}></div>
                                                    </div>
                                                    <span className="font-mono">{m.percent}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Daily Sales */}
                                    <td className="p-4 border-b border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-sm font-bold text-white">
                                                {displayCurrency === 'USD' ? '$' : displayCurrency === 'EUR' ? '€' : '£'}
                                                {(scanResult.estimates.daily_revenue * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </div>
                                            <select
                                                className="bg-black/40 border border-white/10 rounded px-1 py-0.5 text-[10px] text-gray-500 outline-none w-20"
                                                value={displayCurrency}
                                                onChange={(e) => handleCurrencyChange(e.target.value)}
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                        </div>
                                    </td>

                                    {/* Monthly Sales */}
                                    <td className="p-4 border-b border-white/5">
                                        <div className="text-sm font-bold text-luxury-gold">
                                            {displayCurrency === 'USD' ? '$' : displayCurrency === 'EUR' ? '€' : '£'}
                                            {(scanResult.estimates.monthly_revenue * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                        <div className="text-[10px] text-green-400">High Confidence</div>
                                    </td>

                                    {/* Active Ads */}
                                    <td className="p-4 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-white">{scanResult.active_ads}</span>
                                            {scanResult.active_ads > 0 ? (
                                                <div className="flex h-5 px-1.5 bg-green-500/20 text-green-400 rounded items-center text-[10px] font-extrabold border border-green-500/30">
                                                    +12% <TrendingUp size={10} className="ml-1" />
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-gray-600">No signals</div>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-gray-500">Last 30 Days</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Additional Details (Products) */}
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="text-luxury-gold" size={20} />
                        Top Scanned Products
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {scanResult.products.map((p, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col">
                                <div className="aspect-square bg-black rounded-lg overflow-hidden mb-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                                </div>
                                <div className="text-white text-xs font-bold line-clamp-2 mb-1">{p.title}</div>
                                <div className="text-luxury-gold text-xs">${p.price}</div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}

export default function ShopAnalysisPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading analysis workspace...</div>}>
            <AnalysisContent />
        </Suspense>
    );
}

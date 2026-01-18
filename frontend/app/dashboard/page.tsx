'use client';
import { useEffect, useState } from 'react';
import LiveSalesFeed from '@/components/LiveSalesFeed';

interface Analytics {
    total_revenue: number;
    average_order_value: number;
    sales_momentum: number;
    top_products: Array<{ title: string; image_url?: string; units_sold: number; price: string }>;
}

export default function Dashboard() {
    const [data, setData] = useState<Analytics | null>(null);
    const [trackUrl, setTrackUrl] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/get-store-analytics`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleTrack = async () => {
        if (!trackUrl) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/track-new-store`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: trackUrl })
            });
            const json = await res.json();
            if (json.status === 'success') {
                showToast(`Tracking Active: ${trackUrl}`);
                setTrackUrl('');
            } else {
                showToast(`Error: ${json.message}`);
            }
        } catch (e) {
            showToast("Error connecting to server");
        }
    };

    const handleExport = async (product: any) => {
        showToast(`Exporting ${product.title}...`);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/export-product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const json = await res.json();
            if (json.status === 'success') {
                showToast(`Success! Draft created: ${json.product.title}`);
            } else {
                showToast("Export Failed");
            }
        } catch (e) {
            showToast("Export Error");
        }
    };

    const handleSubscribe = async () => {
        // Mock subscription - triggering webhook locally for demo
        try {
            // This is a cheating shortcut for E2E demo to mimic stripe calling us
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/stripe/webhook`, {
                method: 'POST',
                headers: { 'stripe-signature': 'mock_signature' },
                body: JSON.stringify({ type: 'invoice.paid', data: { object: { customer: 'current_user' } } })
            });
            showToast("Pro Plan Activated! (Mock)");
        } catch (e) {
            showToast("Subscription Error");
        }
    };

    return (
        <main className="p-8 text-white font-sans">
            <header className="mb-10 flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-yellow-200 tracking-tighter">
                    Dashboard Overview
                </h1>
                <div className="flex gap-4 items-center">
                    <button onClick={handleSubscribe} className="px-6 py-2 bg-gradient-to-b from-white/10 to-transparent hover:from-luxury-gold/20 hover:to-transparent rounded-lg text-xs font-bold border border-white/20 transition-all shadow-[0_0_20px_-10px_rgba(255,255,255,0.3)] hover:shadow-gold-glow hover:border-luxury-gold/50">
                        [TEST] Subscribe Pro
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-md">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-xs text-gray-300 font-mono">v1.0 • Connected</span>
                    </div>
                </div>
            </header>

            {toast && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-luxury-gold text-black px-6 py-3 rounded-full font-bold shadow-gold-glow animate-bounce">
                    {toast}
                </div>
            )}

            {/* Control Bar */}
            <div className="mb-12 flex gap-4 max-w-3xl">
                <div className="relative flex-1 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-luxury-gold to-white/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <input
                        type="text"
                        placeholder="ENTER SHOPIFY URL (E.G. GYMSHARK.COM)"
                        className="relative w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-6 py-4 outline-none text-white placeholder-gray-600 focus:border-luxury-gold/50 transition-all font-mono text-sm uppercase tracking-wider"
                        value={trackUrl}
                        onChange={(e) => setTrackUrl(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleTrack}
                    className="relative px-8 py-4 bg-gradient-to-b from-luxury-gold to-[#B8860B] text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-gold-glow active:scale-95 whitespace-nowrap"
                >
                    Track Store
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-luxury-gold/50 transition-colors">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-luxury-gold/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Est. Monthly Revenue</h3>
                    <div className="text-4xl font-bold text-white group-hover:text-luxury-gold transition-colors">
                        ${data?.total_revenue.toLocaleString() ?? '...'}
                    </div>
                    <div className={`text-xs mt-2 ${data?.sales_momentum && data.sales_momentum >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data?.sales_momentum}% from last 24h
                    </div>
                </div>

                {/* AOV Card */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-luxury-gold/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Avg. Order Value (AOV)</h3>
                    <div className="text-4xl font-bold text-white">
                        ${data?.average_order_value.toFixed(2) ?? '...'}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest border border-white/5 inline-block px-2 py-1 rounded bg-white/5">Luxury Benchmark</div>
                </div>

                {/* Active Stores (Placeholder) */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-luxury-gold/50 transition-colors">
                    <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Status</h3>
                    <div className="text-xl font-bold text-green-400 flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        System Operational
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Feed */}
                <LiveSalesFeed />

                {/* Top Products */}
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 ring-1 ring-white/5">
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-xl font-black mb-6 tracking-widest uppercase border-b border-white/5 pb-4 flex justify-between items-center">
                        Recent Winners
                        <span className="text-[10px] bg-luxury-gold/10 text-luxury-gold px-2 py-1 rounded border border-luxury-gold/20">REAL-TIME</span>
                    </h3>
                    <div className="space-y-4">
                        {data?.top_products?.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group cursor-default">
                                <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center text-[10px] text-gray-600 border border-white/5 shadow-inner">IMG</div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-200 text-sm tracking-wide group-hover:text-luxury-gold transition-colors">{p.title}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono mt-1">{p.units_sold} UNITS SOLD</p>
                                </div>
                                <button
                                    onClick={() => handleExport(p)}
                                    className="opacity-0 group-hover:opacity-100 bg-luxury-gold hover:bg-[#B8860B] text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-gold-glow translate-x-4 group-hover:translate-x-0"
                                >
                                    Export
                                </button>
                                <div className="text-gray-700 font-black text-2xl opacity-30 group-hover:text-luxury-gold group-hover:opacity-100 transition-all font-serif italic">#{i + 1}</div>
                            </div>
                        )) ?? <div className="h-40 flex items-center justify-center text-gray-600 font-mono text-xs uppercase tracking-widest animate-pulse">Waiting for data...</div>}
                    </div>
                </div>
            </div>
        </main>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ShoppingBag, Globe, Zap, TrendingUp, DollarSign, Layout, Facebook, RefreshCw, Store } from 'lucide-react';

interface StoreData {
    id: number;
    name: string;
    url: string;
    logo: string;
    country: string;
    niche: string;
    revenue: number;
    orders: number;
    traffic: number;
    growth: number;
    active_ads: number;
    source: string;
    best_product: {
        title: string;
        image: string;
        price: number;
    };
}

export default function TopStoresPage() {
    const [filters, setFilters] = useState<StoreSearchFilters>({ keyword: '', sort_by: 'revenue' });
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/stores/search?limit=20', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
            const data = await res.json();
            if (data.results) {
                setStores(data.results);
                setTotal(data.total);
            }
        } catch (error) {
            console.error("Failed to fetch stores:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce or effect for fetching
    // Using useEffect to auto-fetch on filter change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchStores();
        }, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleSearch = () => {
        fetchStores();
    };

    // Presets Logic
    const handlePreset = (preset: string) => {
        // Reset filters first, then apply preset logic
        const newFilters: StoreSearchFilters = { keyword: '', sort_by: 'revenue' };

        switch (preset) {
            case 'US Market':
                newFilters.country = 'US';
                break;
            case 'European Market':
                newFilters.country = 'DE'; // Example proxy for EU
                break;
            case 'Top Facebook':
                newFilters.traffic_source = 'Facebook';
                break;
            case 'New Shops':
                newFilters.sort_by = 'newest';
                break;
            case 'Big Sales':
                newFilters.min_revenue = 100000;
                break;
            case 'Dropshipping':
                newFilters.niche = 'Electronics'; // Proxy for drop
                break;
            case 'Strong Growth':
                newFilters.sort_by = 'traffic'; // Simplification
                break;
        }
        setFilters(newFilters);
    };

    return (
        <main className="p-8 min-h-screen font-sans text-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Store className="text-luxury-gold" />
                        Top Shops
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Discover the best stores identified by our AI</p>
                </div>

                {/* Upgrade Banner (Mock) */}
                <div className="bg-gradient-to-r from-luxury-gold/20 to-yellow-500/10 border border-luxury-gold/30 rounded-lg px-6 py-3 flex items-center gap-4">
                    <span className="text-luxury-gold font-bold text-xs">⚠️ You have 5 searches left with filters on your free trial (5 days).</span>
                    <button className="bg-luxury-gold text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-yellow-500 transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Smart Presets */}
            <div className="mb-6">
                <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-widest">Smart Preset Filters</h3>
                <div className="flex gap-3 flex-wrap">
                    <PresetPill icon={Globe} label="US Market" onClick={() => handlePreset('US Market')} active={filters.country === 'US'} />
                    <PresetPill icon={Globe} label="European Market" onClick={() => handlePreset('European Market')} active={filters.country === 'DE'} />
                    <PresetPill icon={Facebook} label="Top Facebook" onClick={() => handlePreset('Top Facebook')} active={filters.traffic_source === 'Facebook'} />
                    <PresetPill icon={Zap} label="New Shops" onClick={() => handlePreset('New Shops')} active={filters.sort_by === 'newest'} />
                    <PresetPill icon={DollarSign} label="Big Sales" onClick={() => handlePreset('Big Sales')} active={filters.min_revenue === 100000} />
                    <PresetPill icon={RefreshCw} label="Dropshipping" onClick={() => handlePreset('Dropshipping')} active={filters.niche === 'Electronics'} />
                    <PresetPill icon={TrendingUp} label="Strong Growth" onClick={() => handlePreset('Strong Growth')} active={filters.sort_by === 'traffic'} />
                </div>
            </div>

            {/* Search & Advanced Filters */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-xl">
                <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by store name or URL..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-luxury-gold transition-colors"
                            value={filters.keyword}
                            onChange={e => setFilters({ ...filters, keyword: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                    >
                        Search
                    </button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <FunctionalFilterDropdown
                        label="Product Count"
                        value={filters.min_products}
                        options={[{ l: '50+', v: 50 }, { l: '100+', v: 100 }, { l: '500+', v: 500 }]}
                        onChange={v => setFilters({ ...filters, min_products: v ? Number(v) : undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Traffic Growth"
                        value={filters.min_growth}
                        options={[{ l: '10%+', v: 10 }, { l: '50%+', v: 50 }, { l: '100%+', v: 100 }]}
                        onChange={v => setFilters({ ...filters, min_growth: v ? Number(v) : undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Traffic"
                        value={filters.min_traffic}
                        options={[{ l: '10k+', v: 10000 }, { l: '50k+', v: 50000 }, { l: '100k+', v: 100000 }]}
                        onChange={v => setFilters({ ...filters, min_traffic: v ? Number(v) : undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Revenue"
                        value={filters.min_revenue}
                        options={[{ l: '$10k+', v: 10000 }, { l: '$50k+', v: 50000 }, { l: '$100k+', v: 100000 }]}
                        onChange={v => setFilters({ ...filters, min_revenue: v ? Number(v) : undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Ads"
                        value={filters.min_ads}
                        options={[{ l: '10+', v: 10 }, { l: '50+', v: 50 }, { l: '100+', v: 100 }]}
                        onChange={v => setFilters({ ...filters, min_ads: v ? Number(v) : undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Niche"
                        value={filters.niche}
                        options={[{ l: 'Fashion', v: 'Fashion' }, { l: 'Health', v: 'Health/Beauty' }, { l: 'Electronics', v: 'Electronics' }]}
                        onChange={v => setFilters({ ...filters, niche: v || undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Country"
                        value={filters.country}
                        options={[{ l: 'USA', v: 'US' }, { l: 'UK', v: 'UK' }, { l: 'Germany', v: 'DE' }]}
                        onChange={v => setFilters({ ...filters, country: v || undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Pixel"
                        value={filters.pixels}
                        options={[{ l: 'Facebook', v: 'FB' }, { l: 'TikTok', v: 'TikTok' }, { l: 'Google', v: 'Google' }]}
                        onChange={v => setFilters({ ...filters, pixels: v || undefined })}
                    />
                    <FunctionalFilterDropdown
                        label="Source"
                        value={filters.traffic_source}
                        options={[{ l: 'Facebook Ads', v: 'Facebook' }, { l: 'Google Ads', v: 'Google' }, { l: 'Direct', v: 'Direct' }]}
                        onChange={v => setFilters({ ...filters, traffic_source: v || undefined })}
                    />
                </div>
            </div >

            {/* Count & Sort */}
            < div className="flex justify-between items-center mb-4 px-2" >
                <div className="text-sm font-mono text-gray-400">
                    <span className="text-white font-bold">{total.toLocaleString()}</span> Stores Found
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 font-bold text-xs tracking-wider">SORT BY:</span>
                    <div className="relative">
                        <select
                            className="bg-black/40 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white outline-none appearance-none hover:border-luxury-gold/50 transition-colors cursor-pointer"
                            value={filters.sort_by}
                            onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
                        >
                            <option value="revenue">Revenue: High to Low</option>
                            <option value="traffic">Traffic: High to Low</option>
                            <option value="ads">Active Ads: High to Low</option>
                            <option value="newest">Newest Added</option>
                        </select>
                        <Filter size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div >

            {/* Real Data Table */}
            < div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md min-h-[400px]" >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="p-6 font-bold">Store</th>
                            <th className="p-6 font-bold">Best Selling</th>
                            <th className="p-6 font-bold">Traffic</th>
                            <th className="p-6 font-bold">Est. Revenue</th>
                            <th className="p-6 font-bold">Active Ads</th>
                            <th className="p-6 font-bold">Source</th>
                            <th className="p-6 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={7} className="p-12 text-center text-gray-500">Loading stores...</td></tr>
                        ) : stores.map((s) => (
                            <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                {/* Store Info */}
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-white overflow-hidden shrink-0">
                                            <img src={s.logo} className="w-full h-full object-cover" alt="logo" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm group-hover:text-luxury-gold">{s.name}</div>
                                            <a href={`https://${s.url}`} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                                {s.url} <ArrowUpRight size={10} />
                                            </a>
                                            <div className="text-[10px] text-gray-500 mt-0.5">{s.country} • {s.niche}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Best Selling Product */}
                                <td className="p-6">
                                    {s.best_product.image ? (
                                        <div className="flex items-center gap-2">
                                            <img src={s.best_product.image} className="w-8 h-8 rounded border border-white/10 bg-gray-800 object-cover" alt="prod" />
                                            <div className="text-xs text-gray-300 w-24 truncate" title={s.best_product.title}>
                                                {s.best_product.title}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-600">No data</span>
                                    )}
                                </td>

                                {/* Traffic */}
                                <td className="p-6">
                                    <div className="text-sm font-mono text-white">{s.traffic.toLocaleString()}</div>
                                    <div className={`text-[10px] ${s.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {s.growth > 0 ? '+' : ''}{s.growth}%
                                    </div>
                                </td>

                                {/* Revenue */}
                                <td className="p-6">
                                    <div className="text-sm font-bold text-luxury-gold">${s.revenue.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-500">{s.orders.toLocaleString()} orders</div>
                                </td>

                                {/* Ads */}
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm text-white">{s.active_ads}</span>
                                    </div>
                                </td>

                                {/* Source */}
                                <td className="p-6">
                                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                                        {s.source}
                                    </span>
                                </td>

                                {/* Action */}
                                <td className="p-6 text-right">
                                    <a href={`/dashboard/analysis?url=${s.url}`} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 hover:text-white">
                                        Analyze
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </main >
    );
}

interface StoreSearchFilters {
    keyword: string;
    min_revenue?: number;
    min_traffic?: number;
    min_ads?: number;
    min_products?: number;
    min_growth?: number;
    min_orders?: number;
    niche?: string;
    country?: string;
    traffic_source?: string;
    currency?: string;
    pixels?: string;
    sort_by: string;
}

// Components
function PresetPill({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all group ${active ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-yellow-400/50 hover:text-yellow-400'}`}
        >
            <Icon size={14} className={active ? 'text-black' : 'text-gray-400 group-hover:text-yellow-400'} />
            <span className={`text-xs font-bold ${active ? 'text-black' : 'text-gray-300 group-hover:text-yellow-400'}`}>{label}</span>
        </button>
    );
}

// Helper Component for Dropdowns
function FunctionalFilterDropdown({ label, value, options, onChange }: { label: string, value?: string | number, options: { l: string, v: string | number }[], onChange: (val: string) => void }) {
    return (
        <div className="relative group">
            <button className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-bold transition-all ${value ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-transparent border-white/20 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50'}`}>
                {label} {value ? `(${value})` : ''}
                <Filter size={10} className={value ? "opacity-100 text-black" : "opacity-50"} />
            </button>
            <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => onChange(e.target.value)}
                value={value || ''}
            >
                <option value="">Any</option>
                {options.map(opt => (
                    <option key={opt.v} value={opt.v} className="text-black">{opt.l}</option>
                ))}
            </select>
        </div>
    );
}

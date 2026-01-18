'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ArrowUpRight, ShoppingCart, Activity, Zap, Layers, Globe, DollarSign, Star as StarIcon, Flame, TrendingUp, Settings as SettingsIcon } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    price: number;
    image_url: string;
    revenue: number;
    ads_active: number;
    trend: number;
    store: {
        name: string;
        url: string;
        logo: string;
        country: string;
    };
}

interface SearchFilters {
    keyword: string;
    min_price?: number;
    max_price?: number;
    min_ads?: number; // Added
    niche?: string;
    country?: string;
    sort_by: string;
    preset?: string;
}

export default function TopProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Filter State
    const [filters, setFilters] = useState<SearchFilters>({
        keyword: '',
        sort_by: 'revenue_est'
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/products/search?limit=20', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
            const data = await res.json();
            if (data.results) {
                setProducts(data.results);
                setTotal(data.total);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = () => {
        fetchProducts();
    };

    const handlePreset = (preset: string) => {
        setFilters(prev => ({ ...prev, preset: prev.preset === preset ? undefined : preset }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, sort_by: e.target.value }));
    };

    return (
        <main className="p-8 min-h-screen font-sans text-gray-200">
            {/* Header / Title Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <ShoppingBagIcon className="text-luxury-gold" />
                        Top Products
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Discover winning products identified by our AI</p>
                </div>

                {/* Global Actions */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-luxury-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors text-sm">
                        Unlock Full Access
                    </button>
                    <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10">
                        <SettingsIcon size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Smart Presets Bar */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <PresetButton
                    icon={StarIcon}
                    label="Recommended"
                    active={filters.preset === 'recommended'}
                    onClick={() => handlePreset('recommended')}
                />
                <PresetButton
                    icon={Zap}
                    label="Active Ads"
                    active={filters.preset === 'active_ads'}
                    onClick={() => handlePreset('active_ads')}
                />
                <PresetButton
                    icon={Flame}
                    label="New Stores"
                    active={filters.preset === 'new_shops'}
                    onClick={() => handlePreset('new_shops')}
                />
                <PresetButton icon={Activity} label="High Traffic" />
                <PresetButton icon={TrendingUp} label="Traffic Growth" />
            </div>

            {/* Advanced Filter Bar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 backdrop-blur-md">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by keywords..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-luxury-gold outline-none"
                            value={filters.keyword}
                            onChange={e => setFilters({ ...filters, keyword: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    {/* Functional Filters */}
                    <FunctionalFilterDropdown
                        label="Min Price"
                        value={filters.min_price}
                        options={[
                            { label: '$20+', value: 20 },
                            { label: '$50+', value: 50 },
                            { label: '$100+', value: 100 }
                        ]}
                        onChange={(val) => setFilters({ ...filters, min_price: val ? Number(val) : undefined })}
                    />

                    <FunctionalFilterDropdown
                        label="Min Ads"
                        value={filters.min_ads}
                        options={[
                            { label: '10+ Ads', value: 10 },
                            { label: '50+ Ads', value: 50 },
                            { label: '100+ Ads', value: 100 }
                        ]}
                        onChange={(val) => setFilters({ ...filters, min_ads: val ? Number(val) : undefined })}
                    />

                    <FunctionalFilterDropdown
                        label="Niche"
                        value={filters.niche}
                        options={[
                            { label: 'Fashion', value: 'Fashion' },
                            { label: 'Health/Beauty', value: 'Health/Beauty' },
                            { label: 'Electronics', value: 'Electronics' },
                            { label: 'Home/Garden', value: 'Home/Garden' },
                        ]}
                        onChange={(val) => setFilters({ ...filters, niche: val || undefined })}
                    />

                    <FunctionalFilterDropdown
                        label="Country"
                        value={filters.country}
                        options={[
                            { label: 'United States', value: 'US' },
                            { label: 'United Kingdom', value: 'UK' },
                            { label: 'Germany', value: 'DE' },
                            { label: 'France', value: 'FR' },
                        ]}
                        onChange={(val) => setFilters({ ...filters, country: val || undefined })}
                    />

                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Results Count & Sort */}
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-sm font-mono text-gray-400">
                    <span className="text-white font-bold">{total.toLocaleString()}</span> Products Available
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">SORT:</span>
                    <select
                        value={filters.sort_by}
                        onChange={handleSortChange}
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white outline-none cursor-pointer"
                    >
                        <option value="revenue_est">Revenue - High to Low</option>
                        <option value="ads_count">Active Ads - High to Low</option>
                        <option value="price_low">Price - Low to High</option>
                        <option value="created_at">Newest First</option>
                    </select>
                </div>
            </div>

            {/* RICH DATA TABLE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="p-6 font-bold">Product</th>
                            <th className="p-6 font-bold">Store Name</th>
                            <th className="p-6 font-bold">Est. Monthly Revenue</th>
                            <th className="p-6 font-bold">Price</th>
                            <th className="p-6 font-bold">Active Ads</th>
                            <th className="p-6 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-500">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mb-2"></div>
                                    <div>Loading products...</div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-500">
                                    No products found matching your search.
                                </td>
                            </tr>
                        ) : products.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                {/* Product Info */}
                                <td className="p-6">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/10 relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-0 left-0 bg-luxury-gold text-black text-[8px] font-bold px-1">{p.id}</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm group-hover:text-luxury-gold transition-colors line-clamp-1 max-w-[200px]">{p.title}</div>
                                            <a href="#" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mt-1">
                                                View Product <ArrowUpRight size={10} />
                                            </a>
                                        </div>
                                    </div>
                                </td>

                                {/* Store */}
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded bg-white text-black font-bold flex items-center justify-center text-xs shrink-0`}>
                                            <img src={p.store.logo} className="w-full h-full object-cover rounded" alt="logo" />
                                        </div>
                                        <div>
                                            <a href={`https://${p.store.url}`} target="_blank" className="text-sm text-gray-300 hover:text-luxury-gold font-mono block">
                                                {p.store.url}
                                            </a>
                                            {p.store.country && <span className="text-[10px] text-gray-500">{p.store.country}</span>}
                                        </div>
                                    </div>
                                </td>

                                {/* Revenue */}
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-base">${p.revenue.toLocaleString()}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {p.trend > 0 ? '↗' : '↘'} {Math.abs(p.trend)}%
                                        </span>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="p-6">
                                    <span className="font-mono text-gray-300">${p.price}</span>
                                </td>

                                {/* Active Ads */}
                                <td className="p-6">
                                    <div className="font-bold text-white">{p.ads_active.toLocaleString()}</div>
                                    <div className="text-[10px] text-green-400">High Visibility</div>
                                </td>

                                {/* Action */}
                                <td className="p-6 text-right">
                                    <a href={`/dashboard/analysis?url=${p.store.url}`} className="inline-block px-4 py-2 border border-white/20 rounded-lg text-xs font-bold hover:bg-white/10 hover:border-luxury-gold hover:text-luxury-gold transition-all">
                                        Analyze Store
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center text-gray-500 text-xs">
                Showing {products.length} of {total.toLocaleString()} results
            </div>
        </main>
    );
}

// Icons (Lucide wrappers) to fix generic naming errors
const ShoppingBagIcon = (props: any) => <ShoppingCart {...props} />;

// Helper Components with Logic
function PresetButton({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${active ? 'bg-luxury-gold text-black border-luxury-gold' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
        >
            <Icon size={14} />
            {label}
        </button>
    );
}

function FunctionalFilterDropdown({ label, value, options, onChange }: { label: string, value?: string | number, options: { label: string, value: string | number }[], onChange: (val: string) => void }) {
    return (
        <div className="relative group">
            <button className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs transition-all ${value ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold' : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/30'}`}>
                {label} {value ? `(${value})` : ''}
                <Filter size={12} className="opacity-50" />
            </button>
            <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => onChange(e.target.value)}
                value={value || ''}
            >
                <option value="">Any</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="text-black">{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

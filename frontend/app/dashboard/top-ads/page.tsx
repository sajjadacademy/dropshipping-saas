'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Filter, Play, ExternalLink, Globe, Layout, Clock, Facebook, Instagram, Share2, Download, MoreHorizontal, Zap, ChevronDown, Calendar, Database, Eye, Check, X } from 'lucide-react';

// === INTERFACES & CONSTANTS ===

interface AdCreative {
    id: string;
    thumbnail: string;
    platform: string;
    format: string;
    active_days: number;
    start_date: string;
    copy: string;
    cta: string;
    store_name: string;
    store_url: string;
    country: string;
    niche: string;
    status: string;
    live_ads_count: number;
}

interface Niche {
    name: string;
    sub: string[];
}

const CTA_OPTIONS = [
    "Shop Now", "Learn More", "Get Offer", "Buy Now", "Order Now", "Call Now",
    "Sign Up", "Apply Now", "Book Now", "Contact Us", "Download", "Watch More",
    "Subscribe", "Get Quote", "Send Message", "Listen Now", "Install Mobile App",
    "Use App", "Play Game", "See Menu", "Visit Instagram Profile"
];

const ALL_COUNTRIES = [
    { code: "US", name: "United States" }, { code: "CA", name: "Canada" }, { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" }, { code: "DE", name: "Germany" }, { code: "FR", name: "France" },
    { code: "IT", name: "Italy" }, { code: "ES", name: "Spain" }, { code: "BR", name: "Brazil" },
    { code: "JP", name: "Japan" }, { code: "IN", name: "India" }, { code: "CN", name: "China" },
    { code: "MX", name: "Mexico" }, { code: "NL", name: "Netherlands" }, { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" }, { code: "BE", name: "Belgium" }, { code: "AT", name: "Austria" },
    { code: "PL", name: "Poland" }, { code: "RU", name: "Russia" }, { code: "KR", name: "South Korea" },
    { code: "SG", name: "Singapore" }, { code: "AE", name: "United Arab Emirates" }, { code: "SA", name: "Saudi Arabia" },
    { code: "ZA", name: "South Africa" }, { code: "TR", name: "Turkey" }, { code: "ID", name: "Indonesia" },
    { code: "TH", name: "Thailand" }, { code: "MY", name: "Malaysia" }, { code: "VN", name: "Vietnam" },
    { code: "PH", name: "Philippines" }, { code: "NZ", name: "New Zealand" }, { code: "IE", name: "Ireland" },
    { code: "DK", name: "Denmark" }, { code: "NO", name: "Norway" }, { code: "FI", name: "Finland" },
    { code: "PT", name: "Portugal" }, { code: "GR", name: "Greece" }, { code: "CZ", name: "Czech Republic" },
    { code: "HU", name: "Hungary" }, { code: "RO", name: "Romania" }, { code: "IL", name: "Israel" },
    { code: "EG", name: "Egypt" }, { code: "AR", name: "Argentina" }, { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" }, { code: "PE", name: "Peru" }, { code: "PK", name: "Pakistan" },
    { code: "BD", name: "Bangladesh" }, { code: "NG", name: "Nigeria" }
];

const ALL_NICHES: Niche[] = [
    { name: "Fashion", sub: ["Men", "Women", "Shoes", "Accessories", "Jewelry", "Watches", "Bags", "Streetwear", "Luxury"] },
    { name: "Beauty", sub: ["Skincare", "Makeup", "Hair", "Nails", "Perfume", "Tools & Brushes", "Men's Grooming"] },
    { name: "Tech", sub: ["Gadgets", "Phone Accessories", "Home Office", "Computers", "Audio", "Gaming", "Smart Home"] },
    { name: "Home", sub: ["Decor", "Kitchen", "Garden", "Furniture", "Lighting", "Bedding", "Storage", "Cleaning"] },
    { name: "Fitness", sub: ["Equipment", "Clothing", "Supplements", "Yoga", "Recovery", "Gym Gear"] },
    { name: "Health", sub: ["Wellness", "Vitamins", "Medical", "Dental", "Vision", "Mental Health"] },
    { name: "Baby", sub: ["Toys", "Clothing", "Gear", "Feeding", "Nursery", "Maternity"] },
    { name: "Pets", sub: ["Dogs", "Cats", "Food", "Toys", "Grooming", "Accessories"] },
    { name: "Automotive", sub: ["Car Accessories", "Parts", "Tools", "Care & Detailing"] },
    { name: "Travel", sub: ["Luggage", "Accessories", "Camping", "Outdoor Gear"] },
    { name: "Gifts", sub: ["Personalized", "Occasions", "Gadgets", "Novelty"] },
    { name: "Food & Drink", sub: ["Snacks", "Coffee", "Tea", "Alcohol", "Cooking", "Baking"] },
    { name: "Hobbies", sub: ["Art", "Crafts", "Music", "Photography", "DIY"] },
    { name: "Sports", sub: ["Team Sports", "Water Sports", "Winter Sports", "Cycling", "Running"] },
    { name: "Education", sub: ["Courses", "Books", "Supplies", "Languages"] },
    { name: "Services", sub: ["Marketing", "Consulting", "Design", "Development", "Writing"] },
    { name: "Real Estate", sub: ["Residential", "Commercial", "Investing"] },
    { name: "Finance", sub: ["Investing", "Crypto", "Banking", "Insurance"] },
    { name: "Software", sub: ["SaaS", "Apps", "Tools", "Utilities"] },
    { name: "Entertainment", sub: ["Movies", "Games", "Events", "Streaming"] },
    { name: "Other", sub: ["Miscellaneous"] }
];


export default function TopAdsPage() {
    const [ads, setAds] = useState<AdCreative[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalAds, setTotalAds] = useState(0);
    const [paging, setPaging] = useState<{ cursors?: { after?: string }, next?: string }>({});
    const observerTarget = useRef<HTMLDivElement>(null);

    const [filters, setFilters] = useState({
        keyword: '',
        platform: 'All',
        country: [] as string[],
        format: 'All',
        cta: [] as string[],
        niche: [] as string[],
        status: [] as string[],
        minLiveAds: 0,
        dateRange: { start: '', end: '' }
    });

    const [transparency, setTransparency] = useState(true);

    // Fetch ads on mount and filter change
    useEffect(() => {
        fetchAds();
    }, [filters]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && paging?.cursors?.after && !loading) {
                    fetchAds(true);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [paging, loading]);

    const fetchAds = async (isLoadMore = false) => {
        if (!isLoadMore) setLoading(true); // Only show full loader on fresh search

        try {
            const query = new URLSearchParams({
                keyword: filters.keyword,
                platform: filters.platform,
                country: filters.country.join(','),
                format: filters.format,
                status: filters.status.join(','),
                niche: filters.niche.join(','),
                min_live_ads: filters.minLiveAds.toString(),
                cta: filters.cta.join(','),
                date_start: filters.dateRange.start,
                date_end: filters.dateRange.end,
                cursor: isLoadMore && paging.cursors?.after ? paging.cursors.after : ''
            });
            const res = await fetch(`http://localhost:8000/api/ads/search?${query}`);
            const data = await res.json();

            if (isLoadMore) {
                setAds(prev => [...prev, ...(data.ads || [])]);
            } else {
                setAds(data.ads || []);
                setTotalAds(data.total || 0);
            }
            setPaging(data.paging || {});
        } catch (error) {
            console.error('Failed to fetch ads:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen font-sans text-gray-200 bg-black flex flex-col items-center">

            <div className="w-full max-w-[1600px] p-6">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Layout className="text-luxury-gold" />
                            Top Ads
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Discover the best ads identified by our AI</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by keywords..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-luxury-gold transition-colors backdrop-blur-sm"
                            value={filters.keyword}
                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && fetchAds(false)}
                        />
                    </div>
                    <button onClick={() => fetchAds(false)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                        Search
                    </button>
                </div>

                {/* Smart Presets */}
                <div className="mb-6">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Smart Preset Filters</h3>
                    <div className="flex gap-3">
                        <PresetPill icon={Globe} label="Market FR" active={filters.country.includes('FR')} onClick={() => setFilters({ ...filters, country: ['FR'] })} />
                        <PresetPill icon={Clock} label="Recent Winners" active={false} onClick={() => { }} />
                        <PresetPill icon={Globe} label="US Market" active={filters.country.includes('US')} onClick={() => setFilters({ ...filters, country: ['US'] })} />
                    </div>
                </div>

                {/* Horizontal Filter Bar */}
                <div className="mb-6 space-y-4">
                    <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Filters</h3>
                    <div className="flex flex-wrap gap-3 items-center bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-md">

                        {/* Dates */}
                        <FilterDropdown icon={Calendar} label="Dates">
                            {(close) => (
                                <DateFilter
                                    range={filters.dateRange}
                                    onApply={(val) => { setFilters({ ...filters, dateRange: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                        {/* CTA */}
                        <FilterDropdown icon={MoreHorizontal} label="CTA List">
                            {(close) => (
                                <SearchableMultiSelectFilter
                                    options={CTA_OPTIONS}
                                    selected={filters.cta}
                                    placeholder="Search CTAs..."
                                    onApply={(val) => { setFilters({ ...filters, cta: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                        {/* Media Type */}
                        <FilterDropdown icon={Play} label="Media Type">
                            {(close) => (
                                <FormatFilter
                                    selected={filters.format}
                                    onApply={(val) => { setFilters({ ...filters, format: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                        {/* Country */}
                        <FilterDropdown icon={Globe} label="Country">
                            {(close) => (
                                <CountryFilter
                                    selected={filters.country}
                                    onApply={(val) => { setFilters({ ...filters, country: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                        {/* Niche */}
                        <FilterDropdown icon={Database} label="Niche">
                            {(close) => (
                                <NicheFilter
                                    niches={ALL_NICHES}
                                    selected={filters.niche}
                                    onApply={(val) => { setFilters({ ...filters, niche: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                        {/* Status */}
                        <FilterDropdown icon={Filter} label="Status">
                            {(close) => (
                                <StatusFilter
                                    selected={filters.status}
                                    onApply={(val) => { setFilters({ ...filters, status: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                        {/* Live Ads */}
                        <FilterDropdown icon={Eye} label={`Live Ads: ${filters.minLiveAds}+`}>
                            {(close) => (
                                <LiveAdsFilter
                                    minLiveAds={filters.minLiveAds}
                                    onApply={(val) => { setFilters({ ...filters, minLiveAds: val }); close(); }}
                                />
                            )}
                        </FilterDropdown>

                    </div>
                </div>

                {/* Toggles & Count */}
                <div className="flex items-center justify-between mb-6 bg-white/5 px-4 py-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${transparency ? 'bg-luxury-gold' : 'bg-gray-700'}`}
                            onClick={() => setTransparency(!transparency)}
                        >
                            <div className={`w-3 h-3 bg-black rounded-full absolute top-1 transition-transform ${transparency ? 'left-6' : 'left-1'}`}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-300">EU Transparency</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">NEW</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-mono text-gray-400">
                            <span className="bg-white/10 px-2 py-1 rounded text-white font-bold mr-2">{totalAds.toLocaleString()}</span>
                            Total Ads
                        </div>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sort:</span>
                            <select className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold">
                                <option>Recommended - AI powered ranking based on ads</option>
                                <option>Newest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* AD GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {loading && ads.length === 0 ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white/5 border border-white/5 rounded-2xl animate-pulse">
                                <div className="h-1/2 bg-white/5"></div>
                                <div className="p-4 space-y-2">
                                    <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                                    <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : ads.length > 0 ? (
                        <>
                            {ads.map((ad) => (
                                <AdCard key={ad.id} ad={ad} />
                            ))}
                            {/* Observer Element */}
                            <div ref={observerTarget} className="col-span-full h-10 w-full flex justify-center items-center">
                                {loading && <div className="w-6 h-6 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>}
                            </div>
                        </>
                    ) : (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                            <Search className="text-gray-600 mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-bold text-white mb-2">No Ads Found</h3>
                            <p className="text-gray-500">Adjust your filters to see results.</p>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}

// === COMPONENT HELPERS ===

function ApplyButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full py-2 bg-blue-400 hover:bg-blue-300 text-black text-xs font-bold rounded mt-2 transition-colors shadow-lg shadow-blue-500/20"
        >
            Apply Filter
        </button>
    )
}

function DateFilter({ range, onApply }: { range: { start: string, end: string }, onApply: (val: { start: string, end: string }) => void }) {
    const [start, setStart] = useState(range.start);
    const [end, setEnd] = useState(range.end);

    return (
        <div className="p-4 w-64 bg-[#1a1a1a]">
            <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Date Range</div>
            <div className="space-y-3">
                <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Start Date</label>
                    <input
                        type="date"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-luxury-gold"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 block mb-1">End Date</label>
                    <input
                        type="date"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-luxury-gold"
                    />
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
                <ApplyButton onClick={() => onApply({ start, end })} />
            </div>
        </div>
    )
}

function SearchableMultiSelectFilter({ options, selected, placeholder, onApply }: { options: string[], selected: string[], placeholder: string, onApply: (val: string[]) => void }) {
    const [temp, setTemp] = useState(selected);
    const [search, setSearch] = useState('');

    const toggle = (opt: string) => {
        setTemp(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
    }

    const filteredOptions = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-3 w-64">
            <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded pl-8 pr-2 py-1.5 text-xs text-white outline-none focus:border-luxury-gold transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${temp.includes(opt) ? 'bg-luxury-gold border-luxury-gold' : 'border-gray-600 group-hover:border-white/50'}`}>
                            {temp.includes(opt) && <Check size={10} className="text-black" />}
                        </div>
                        <span className={`text-xs ${temp.includes(opt) ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-300'}`}>{opt}</span>
                        <input type="checkbox" className="hidden" checked={temp.includes(opt)} onChange={() => toggle(opt)} />
                    </label>
                )) : (
                    <div className="text-center text-gray-500 text-xs py-4">No results found</div>
                )}
            </div>
            <div className="mt-3 pt-2 border-t border-white/10">
                <ApplyButton onClick={() => onApply(temp)} />
            </div>
        </div>
    )
}

function CountryFilter({ selected, onApply }: { selected: string[], onApply: (val: string[]) => void }) {
    const [temp, setTemp] = useState(selected);
    const [search, setSearch] = useState('');

    const toggle = (code: string) => {
        setTemp(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
    }

    const filteredCountries = ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-3 w-64">
            <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                <input
                    type="text"
                    placeholder="Search Country..."
                    className="w-full bg-white/5 border border-white/10 rounded pl-8 pr-2 py-1.5 text-xs text-white outline-none focus:border-luxury-gold transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                {filteredCountries.map(c => (
                    <label key={c.code} className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500 w-6">{c.code}</span>
                            <span className={`text-xs ${temp.includes(c.code) ? 'text-white font-bold' : 'text-gray-300'}`}>{c.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${temp.includes(c.code) ? 'bg-luxury-gold border-luxury-gold' : 'border-gray-600 group-hover:border-white/50'}`}>
                            {temp.includes(c.code) && <Check size={10} className="text-black" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={temp.includes(c.code)} onChange={() => toggle(c.code)} />
                    </label>
                ))}
            </div>
            <div className="mt-3 pt-2 border-t border-white/10">
                <ApplyButton onClick={() => onApply(temp)} />
            </div>
        </div>
    )
}

function NicheFilter({ niches, selected, onApply }: { niches: Niche[], selected: string[], onApply: (val: string[]) => void }) {
    const [temp, setTemp] = useState(selected);
    const [search, setSearch] = useState('');

    const toggle = (name: string) => {
        setTemp(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    }

    const filteredNiches = niches.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-3 w-72">
            <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                <input
                    type="text"
                    placeholder="Search Niche..."
                    className="w-full bg-white/5 border border-white/10 rounded pl-8 pr-2 py-1.5 text-xs text-white outline-none focus:border-luxury-gold transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {filteredNiches.map(niche => (
                    <div key={niche.name} className="mb-2">
                        <label className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer group hover:bg-white/5">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${temp.includes(niche.name) ? 'bg-luxury-gold border-luxury-gold' : 'border-gray-600 group-hover:border-white/50'}`}>
                                {temp.includes(niche.name) && <Check size={10} className="text-black" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={temp.includes(niche.name)}
                                onChange={() => toggle(niche.name)}
                            />
                            <span className={`text-xs font-bold ${temp.includes(niche.name) ? 'text-luxury-gold' : 'text-gray-400 group-hover:text-white'}`}>
                                {niche.name}
                            </span>
                        </label>

                        {/* Sub Niches (Visual only for now, could be selectable too) */}
                        {temp.includes(niche.name) && niche.sub.length > 0 && (
                            <div className="pl-8 text-[10px] text-gray-600 flex flex-wrap gap-2 mt-1 mb-2">
                                {niche.sub.map(s => <span key={s} className="bg-white/5 px-1.5 py-0.5 rounded">{s}</span>)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="sticky bottom-0 bg-[#1a1a1a] pb-1 pt-2 border-t border-white/10">
                <ApplyButton onClick={() => onApply(temp)} />
            </div>
        </div>
    )
}

function StatusFilter({ selected, onApply }: { selected: string[], onApply: (val: string[]) => void }) {
    const [temp, setTemp] = useState(selected);
    const toggle = (val: string) => setTemp(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <div className="p-2 w-48">
            <label className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${temp.includes('Active') ? 'bg-green-500 border-green-500' : 'border-gray-600 group-hover:border-white/50'}`}>
                    {temp.includes('Active') && <Check size={10} className="text-black" />}
                </div>
                <input type="checkbox" className="hidden" checked={temp.includes('Active')} onChange={() => toggle('Active')} />
                <span className="text-xs text-gray-300">Active</span>
            </label>
            <label className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${temp.includes('Inactive') ? 'bg-red-500 border-red-500' : 'border-gray-600 group-hover:border-white/50'}`}>
                    {temp.includes('Inactive') && <Check size={10} className="text-black" />}
                </div>
                <input type="checkbox" className="hidden" checked={temp.includes('Inactive')} onChange={() => toggle('Inactive')} />
                <span className="text-xs text-gray-300">Inactive</span>
            </label>
            <ApplyButton onClick={() => onApply(temp)} />
        </div>
    )
}

function FormatFilter({ selected, onApply }: { selected: string, onApply: (val: string) => void }) {
    const [temp, setTemp] = useState(selected);
    return (
        <div className="p-2 w-40">
            <button onClick={() => setTemp('Video')} className={`w-full text-left px-3 py-2 rounded text-xs mb-1 ${temp === 'Video' ? 'bg-yellow-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-yellow-400'}`}>Video Only</button>
            <button onClick={() => setTemp('Image')} className={`w-full text-left px-3 py-2 rounded text-xs mb-1 ${temp === 'Image' ? 'bg-yellow-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-yellow-400'}`}>Image Only</button>
            <button onClick={() => setTemp('All')} className={`w-full text-left px-3 py-2 rounded text-xs ${temp === 'All' ? 'bg-yellow-400 text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-yellow-400'}`}>All Formats</button>
            <ApplyButton onClick={() => onApply(temp)} />
        </div>
    )
}

function LiveAdsFilter({ minLiveAds, onApply }: { minLiveAds: number, onApply: (val: number) => void }) {
    const [temp, setTemp] = useState(minLiveAds);
    return (
        <div className="p-4 w-60">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>0</span>
                <span>100+</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={temp}
                onChange={(e) => setTemp(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-luxury-gold mb-4"
            />
            <div className="flex justify-between gap-2 mb-2">
                <button onClick={() => setTemp(10)} className="flex-1 py-1 bg-white/5 border border-white/10 rounded text-[10px] hover:bg-white/10">10+</button>
                <button onClick={() => setTemp(50)} className="flex-1 py-1 bg-white/5 border border-white/10 rounded text-[10px] hover:bg-white/10">50+</button>
            </div>
            <ApplyButton onClick={() => onApply(temp)} />
        </div>
    )
}


function AdCard({ ad }: { ad: AdCreative }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all group flex flex-col relative light-theme-card">
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {ad.store_name[0]}
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 text-xs">{ad.store_name}</div>
                        <div className="text-[10px] text-green-600 flex items-center gap-1 font-medium bg-green-50 px-1.5 py-0.5 rounded-full mt-0.5 w-fit">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            All active for {ad.active_days} days
                        </div>
                    </div>
                </div>
                <div className="p-1.5 hover:bg-gray-50 rounded text-gray-400 cursor-pointer">
                    <MoreHorizontal size={14} />
                </div>
            </div>

            {/* Ad Copy */}
            <div className="p-3 bg-white">
                <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                    {ad.copy}
                </p>
                <button className="text-[10px] text-gray-400 mt-1 font-medium hover:text-gray-600">...Show More</button>
            </div>

            {/* Media Frame */}
            <div className="relative aspect-square bg-gray-100">
                <img src={ad.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Download size={14} className="text-gray-600" />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-white border-t border-gray-50 mt-auto">
                <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors">
                    {ad.cta}
                    <ExternalLink size={12} />
                </button>
            </div>
        </div>
    )
}

function FilterDropdown({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: (close: () => void) => React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const close = () => setIsOpen(false);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${isOpen ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-400'}`}
            >
                <Icon size={14} className={isOpen ? 'text-black' : ''} />
                {label}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180 text-black' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 min-w-max backdrop-blur-xl">
                    {children(close)}
                </div>
            )}
        </div>
    );
}

function PresetPill({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all group ${active ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-yellow-400 hover:border-yellow-400/50'}`}
        >
            <Icon size={12} className={active ? 'text-black' : 'group-hover:text-yellow-400'} />
            <span className={`text-[10px] font-bold ${active ? 'text-black' : ''}`}>{label}</span>
        </button>
    );
}

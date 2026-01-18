'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Store, Zap, Search, Settings, FileText, Database, LifeBuoy } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Top Products', icon: ShoppingBag, path: '/dashboard/top-products', badge: 'HOT' },
        { name: 'Top Stores', icon: Store, path: '/dashboard/top-stores' },
        { name: 'Top Ads', icon: Zap, path: '/dashboard/top-ads' },
    ];

    const toolsItems = [
        { name: 'Product Search', icon: Search, path: '/dashboard/product-search' },
        { name: 'Store Analysis', icon: Search, path: '/dashboard/analysis' },
        { name: 'AI Store Builder', icon: Database, path: '/dashboard/ai-store', badge: 'NEW' },
        { name: 'AI Ads Manager', icon: Zap, path: '/dashboard/ads-manager', badge: 'BETA' },
        { name: 'Product Export', icon: FileText, path: '/dashboard/export' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-64 h-screen bg-deep-obsidian border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-tighter">
                    DS shop
                </h1>
            </div>

            {/* Global Search */}
            <div className="px-4 mb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                        type="text"
                        placeholder="Search stores or URLs..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-yellow-400/50 transition-colors placeholder:text-gray-600"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = e.currentTarget.value;
                                if (!val) return;
                                if (val.includes('.') || val.includes('http')) {
                                    window.location.href = `/dashboard/analysis?url=${encodeURIComponent(val)}`;
                                } else {
                                    window.location.href = `/dashboard/top-stores?keyword=${encodeURIComponent(val)}`;
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {/* Main Menu */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Platform</h3>
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${isActive(item.path)
                                        ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                        : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/5'
                                        }`}
                                >
                                    <item.icon size={18} className={isActive(item.path) ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-300'} />
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold border border-red-500/30">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tools */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Tools</h3>
                    <ul className="space-y-1">
                        {toolsItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${isActive(item.path)
                                        ? 'bg-luxury-gold/10 text-luxury-gold'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={18} className="text-gray-500 group-hover:text-white" />
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold border border-green-500/30">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Resources */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Resources</h3>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
                        <LifeBuoy size={18} />
                        Support / FAQ
                    </Link>
                </div>
            </div>

            {/* Upgrade CTA */}
            <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-center relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <h4 className="font-bold text-white text-sm mb-1 relative z-10">Free Trial Active</h4>
                <p className="text-[10px] text-indigo-100 mb-3 relative z-10">5 days remaining</p>
                <div className="w-full h-1.5 bg-black/20 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-luxury-gold w-[70%]"></div>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard/billing'}
                    className="w-full py-2 bg-white text-indigo-900 text-xs font-black rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Zap size={12} fill="currentColor" />
                    UPGRADE NOW
                </button>
            </div>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-luxury-gold to-yellow-200 border border-white/20"></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Pro User</p>
                        <p className="text-xs text-gray-500 truncate">pro@zelvyra.com</p>
                    </div>
                    <Settings size={16} className="text-gray-500" />
                </div>
            </div>
        </div>
    );
}

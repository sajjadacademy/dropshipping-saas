'use client';
import { useState } from 'react';
import { Check, Zap, Shield, Crown } from 'lucide-react';

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (priceId: string, planName: string) => {
        setLoading(priceId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/payment/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price_id: priceId,
                    success_url: window.location.href, // Return here
                    cancel_url: window.location.href
                })
            });
            const json = await res.json();
            if (json.url) {
                window.location.href = json.url;
            } else {
                alert("Payment initiation failed");
            }
        } catch (error) {
            console.error(error);
            alert("Connection error");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-deep-obsidian p-8 font-sans text-gray-200">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Crown className="text-luxury-gold" /> Plans & Billing
            </h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Basic Plan */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                    <div className="text-2xl font-bold">$14.99<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="mt-6 space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500" /> 100 Searches</li>
                        <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500" /> 1 AI Store</li>
                        <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500" /> Basic Support</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('price_basic_123', 'Basic')}
                        disabled={!!loading}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
                    >
                        {loading === 'price_basic_123' ? 'Processing...' : 'Select Basic'}
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-black border-2 border-luxury-gold p-8 rounded-2xl flex flex-col transform md:-translate-y-4 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                    <div className="text-xs font-bold text-luxury-gold uppercase tracking-widest mb-2">Most Popular</div>
                    <h3 className="text-xl font-bold text-white mb-2">Standard Pro</h3>
                    <div className="text-3xl font-black text-luxury-gold">$29.99<span className="text-sm text-gray-500 text-white">/mo</span></div>
                    <ul className="mt-6 space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-white font-bold"><Check size={16} className="text-luxury-gold" /> Unlimited Searches</li>
                        <li className="flex gap-2 text-sm text-white font-bold"><Check size={16} className="text-luxury-gold" /> 5 AI Stores</li>
                        <li className="flex gap-2 text-sm text-white font-bold"><Check size={16} className="text-luxury-gold" /> Ad Spy Access</li>
                        <li className="flex gap-2 text-sm text-white font-bold"><Check size={16} className="text-luxury-gold" /> Priority Support</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('price_pro_123', 'Pro')}
                        disabled={!!loading}
                        className="w-full py-3 bg-luxury-gold hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors shadow-lg shadow-yellow-400/20"
                    >
                        {loading === 'price_pro_123' ? 'Processing...' : 'Upgrade Now'}
                    </button>
                </div>

                {/* Elite Plan */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">Agency Elite</h3>
                    <div className="text-2xl font-bold">$99.00<span className="text-sm text-gray-500">/mo</span></div>
                    <ul className="mt-6 space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500" /> Everything in Pro</li>
                        <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500" /> 50 AI Stores</li>
                        <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-green-500" /> Whitelabel Reports</li>
                    </ul>
                    <button
                        onClick={() => handleUpgrade('price_agency_123', 'Agency')}
                        disabled={!!loading}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
                    >
                        {loading === 'price_agency_123' ? 'Processing...' : 'Contact Sales'}
                    </button>
                </div>

            </div>

            <div className="max-w-6xl mx-auto mt-12 p-6 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="font-bold flex items-center gap-2"><Shield size={18} className="text-green-500" /> Secure Payment</h3>
                    <p className="text-xs text-gray-500">All payments are processed securely by Stripe.</p>
                </div>
                <div className="flex gap-4 opacity-50 grayscale">
                    {/* Icons would go here */}
                    <div className="font-bold text-xl">VISA</div>
                    <div className="font-bold text-xl">mastercard</div>
                    <div className="font-bold text-xl">stripe</div>
                </div>
            </div>

        </div>
    );
}

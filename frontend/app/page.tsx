'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Zap, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function LandingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const price = (amount: number) => isYearly ? (amount * 12 * 0.8).toFixed(2) : amount;
  const period = isYearly ? '/year' : '/mo';

  return (
    <main className="min-h-screen bg-deep-obsidian text-white overflow-x-hidden font-sans">

      {/* BACKGROUND: 3D Dimension Layer */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <img
          src="/landing-hero-3d.png"
          alt="3D Background"
          className="w-full h-full object-cover animate-pulse-slow scale-105"
          style={{ animationDuration: '10s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-obsidian via-deep-obsidian/80 to-transparent"></div>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-deep-obsidian/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-black text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.5)]">DS</div>
            <span className="text-xl font-bold tracking-tighter">DS shop</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-yellow-400 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="text-sm font-bold text-white hover:text-yellow-400 transition-colors">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-300">The Dropshipping Revolution is Here</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            The Hustle is <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-800 line-through decoration-red-500 decoration-4">Real.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-text-shimmer bg-[length:200%_auto]">
              AI Solves It.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Stop guessing products. Stop wasting ad spend. <br />
            <strong className="text-white">DS shop</strong> is the only AI-powered ecosystem that finds winners, builds stores, and runs your ads on autopilot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2">
              Launch Your Empire <ArrowRight size={20} />
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-full transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              <Zap size={20} className="text-yellow-400" /> Watch Demo
            </a>
          </div>
        </motion.div>

        {/* Social Proof (Stub) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 pt-10 border-t border-white/5 flex gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Trusted By Ecom Giants</span>
          {/* Add actual logos later */}
          <div className="text-xl font-black text-gray-500">Shopify</div>
          <div className="text-xl font-black text-gray-500">TikTok</div>
          <div className="text-xl font-black text-gray-500">Meta</div>
        </motion.div>

      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section id="features" className="relative z-10 py-24 px-6 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Unfair Advantage? <span className="text-yellow-400">Absolutely.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Most dropshippers fail because they guess. You succeed because you know.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card: AI Spy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-400/50 transition-colors group relative overflow-hidden h-96"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-bold">Spy on Revenue & Ads</h3>
                </div>
                <p className="text-gray-400 mb-6 max-w-md text-sm">
                  See exactly what's selling right now. Track competitors' live sales, revenue, and active ads in real-time.
                </p>

                {/* Feature Image */}
                <img
                  src="/feature-spy.png"
                  alt="Analytics Dashboard"
                  className="w-full h-64 object-cover rounded-xl border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity mt-2"
                />
              </div>
            </motion.div>

            {/* Tall Card: Auto Store */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:row-span-2 p-8 rounded-3xl bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-400/20 hover:border-yellow-400 transition-colors group relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/20">
                <Zap size={24} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Build in 30s</h3>
              <p className="text-gray-400 mb-8 text-sm">
                AI builds your entire branded store. Logo, products, copy—done.
              </p>

              {/* Mobile Store Mockup */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-80 bg-black border-4 border-gray-800 rounded-t-3xl overflow-hidden shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {/* Screen Content */}
                <div className="w-full h-full bg-deep-obsidian flex flex-col relative">
                  {/* Header / Banner */}
                  <div className="h-28 bg-gradient-to-br from-purple-900 to-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=300&auto=format&fit=crop')] bg-cover opacity-60"></div>
                    <div className="absolute bottom-2 left-3 text-white font-bold text-lg drop-shadow-md">Your Store</div>
                  </div>

                  {/* Products Grid */}
                  <div className="p-3 grid grid-cols-2 gap-2 overflow-hidden">
                    {/* Product 1 */}
                    <div className="bg-white/5 rounded-lg p-1.5 flex flex-col gap-1">
                      <div className="h-16 w-full bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop')] bg-cover rounded-md"></div>
                      <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
                      <div className="h-1.5 w-1/2 bg-yellow-400/80 rounded-full"></div>
                    </div>
                    {/* Product 2 */}
                    <div className="bg-white/5 rounded-lg p-1.5 flex flex-col gap-1">
                      <div className="h-16 w-full bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop')] bg-cover rounded-md"></div>
                      <div className="h-1.5 w-full bg-white/20 rounded-full"></div>
                      <div className="h-1.5 w-1/2 bg-yellow-400/80 rounded-full"></div>
                    </div>
                  </div>

                  {/* Shop Button */}
                  <div className="mt-auto p-3 bg-gradient-to-t from-black to-transparent">
                    <div className="w-full h-8 bg-white text-black rounded text-xs font-bold flex items-center justify-center hover:bg-yellow-400 transition-colors">Shop Now</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card: Ad Manager */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-blue-400">Meta</span> & <span className="text-pink-500">TikTok</span>
                </h3>
                <p className="text-sm text-gray-400">
                  Launch high-converting campaigns instantly.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-2 w-full bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-500"></div>
                </div>
                <div className="h-2 w-full bg-pink-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-pink-500"></div>
                </div>
              </div>
            </motion.div>

            {/* Card: One Click Push */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-green-400">Sync</h3>
                <Check size={16} className="text-green-500 bg-green-500/10 p-1 rounded-full w-6 h-6" />
              </div>
              <p className="text-sm text-gray-400">
                Push products to Shopify with one click.
              </p>
            </motion.div>

            {/* NEW Card: Global Suppliers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-400/50 transition-colors group flex items-center gap-8"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-white">Global Supplier Network</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Connect instantly with premium suppliers from AliExpress, Alibaba, and CJ Dropshipping.
                  <span className="text-yellow-400"> Fast shipping, lower costs.</span>
                </p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-orange-600/20 text-orange-400 rounded-lg text-xs font-bold border border-orange-600/30">AliExpress</div>
                  <div className="px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg text-xs font-bold border border-yellow-600/30">Alibaba</div>
                  <div className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold border border-blue-600/30">CJ Drop</div>
                </div>
              </div>
              {/* Graphic Mockup */}
              <div className="hidden md:flex relative w-40 h-32 items-center justify-center">
                <div className="absolute w-24 h-24 bg-yellow-400/10 rounded-full animate-pulse"></div>
                <div className="absolute w-32 h-32 bg-yellow-400/5 rounded-full animate-pulse delay-100"></div>
                <div className="z-10 bg-black border border-yellow-400 rounded-xl p-3 shadow-lg shadow-yellow-400/20">
                  <div className="text-xs font-bold text-white text-center">Connected</div>
                  <div className="text-[10px] text-green-400 text-center">● Online</div>
                </div>
                {/* Floating Orbits */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Invest in Your <span className="text-yellow-400">Empire.</span>
            </h2>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-bold ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="w-16 h-8 bg-white/10 rounded-full p-1 relative transition-colors hover:bg-white/20"
              >
                <div className={`w-6 h-6 bg-yellow-400 rounded-full shadow-lg transition-all duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-bold ${isYearly ? 'text-white' : 'text-gray-500'}`}>
                Yearly <span className="text-yellow-400 text-xs ml-1">(20% OFF)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
              <h3 className="text-lg font-bold text-gray-400 mb-2">Free Trial</h3>
              <div className="text-3xl font-black mb-1">$0<span className="text-sm font-medium text-gray-500">/3days</span></div>
              <p className="text-xs text-gray-500 mb-6">Test the waters.</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> 15 Searches</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Basic Filters</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> AI Store Builder (Demo)</li>
              </ul>
              <Link href="/sign-up" className="block text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-colors">Start Free</Link>
            </div>

            {/* Basic Plan */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-2">Basic</h3>
              <div className="text-3xl font-black mb-1">${price(14.99)}<span className="text-sm font-medium text-gray-500">{period}</span></div>
              <p className="text-xs text-gray-500 mb-6">For starters.</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> 100 Searches/mo</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> 1 AI Store</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> Shopify Connect</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> Customer Support</li>
              </ul>
              <Link href="/sign-up" className="block text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-colors">Get Basic</Link>
            </div>

            {/* Standard Plan (POPULAR) */}
            <div className="p-8 rounded-3xl bg-black border-2 border-yellow-400 relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Standard</h3>
              <div className="text-4xl font-black mb-1">${price(29.99)}<span className="text-sm font-medium text-gray-500">{period}</span></div>
              <p className="text-xs text-gray-500 mb-6">For serious scalers.</p>
              <ul className="space-y-3 mb-8 text-sm text-white">
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> 1,000 Searches/mo</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> 5 AI Stores</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> 3,000 Product Pushes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> Priority Support</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-yellow-400" /> Ad Manager Design</li>
              </ul>
              <Link href="/sign-up" className="block text-center py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold transition-colors shadow-lg shadow-yellow-400/20">Go Standard</Link>
            </div>

            {/* Custom Plan */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
              <div className="text-3xl font-black mb-1">Custom</div>
              <p className="text-xs text-gray-500 mb-6">For agencies.</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Unlimited Access</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Dedicated Manager</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-white" /> Custom API Access</li>
              </ul>
              <a href="mailto:contact@dsshop.com" className="block text-center py-3 rounded-xl border border-white/20 hover:bg-white/10 font-bold transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black/80 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center text-black font-black text-xs">DS</div>
          <span className="text-lg font-bold tracking-tighter">DS shop</span>
        </div>
        <div className="flex justify-center gap-8 text-sm text-gray-500 mb-8 font-medium">
          <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Contact Support</a>
        </div>
        <div className="flex justify-center gap-6 mb-8 text-gray-600">
          <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
          <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
          <Linkedin size={20} className="hover:text-white cursor-pointer transition-colors" />
          <Github size={20} className="hover:text-white cursor-pointer transition-colors" />
        </div>
        <p className="text-xs text-gray-700">© 2026 DS Shop Inc. All rights reserved.</p>
      </footer>

    </main>
  );
}

import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-deep-obsidian flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 space-y-8 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-yellow-100 tracking-tighter">
          ZELVYRA
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
          The automated spy tool for the <span className="text-luxury-gold font-medium">1%</span>.
          Track Shopify stores, analyze momentum, and dominate the market.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Link href="/dashboard" className="px-8 py-3 bg-luxury-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-gold-glow">
            Enter Dashboard
          </Link>
          <Link href="/sign-in" className="px-8 py-3 bg-white/5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all backdrop-blur-md">
            Sign In
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-white/20 text-xs">
        System Status: Operational • v1.0.0
      </footer>
    </main>
  );
}

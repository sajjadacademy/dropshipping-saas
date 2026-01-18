'use client';
import { useEffect, useState } from 'react';

interface Sale {
    id: string;
    product_title: string;
    revenue: number;
    timestamp: string;
}

export default function LiveSalesFeed() {
    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/stream-sales`);
                if (!response.body) return;

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    // Assuming the stream sends newline-separated JSON objects
                    const lines = chunk.split('\n').filter(Boolean);

                    for (const line of lines) {
                        try {
                            const newSale = JSON.parse(line);
                            // Chunk Received

                            setSales(prev => [newSale, ...prev].slice(0, 10)); // Keep last 10
                        } catch (e) {
                            console.error("Error parsing sales chunk", e);
                        }
                    }
                }
            } catch (err) {
                console.error("Stream failed", err);
            }
        };

        fetchStream();
    }, []);

    return (
        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-96 overflow-hidden">
            <h3 className="text-luxury-gold text-xl font-bold mb-4 tracking-wider uppercase border-b border-white/10 pb-2">Live Sales Feed</h3>
            <div className="space-y-4">
                {sales.map((sale) => (
                    <div
                        key={sale.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-black/40 border-l-2 border-luxury-gold animate-slide-in hover:bg-black/60 transition-colors shadow-gold-glow"
                        style={{ animation: 'slideIn 0.5s ease-out' }}
                    >
                        <div>
                            <p className="text-gray-200 font-medium text-sm">{sale.product_title}</p>
                            <p className="text-gray-500 text-xs">{new Date(sale.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <div className="text-luxury-gold font-bold">
                            +${sale.revenue.toFixed(2)}
                        </div>
                    </div>
                ))}
                {sales.length === 0 && (
                    <p className="text-gray-500 text-center mt-10 italic">Waiting for incoming sales...</p>
                )}
            </div>
            <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}

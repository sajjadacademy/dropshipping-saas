"use client";

import Sidebar from '@/components/Sidebar';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SignedIn>
                <div className="flex min-h-screen bg-deep-obsidian">
                    {/* Sidebar (Fixed width) */}
                    <Sidebar />

                    {/* Main Content (Offset by sidebar width) */}
                    <div className="flex-1 ml-64 relative">
                        {/* Top Noise Overlay for content area too */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}

import { SignIn } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-deep-obsidian">
            <SignIn appearance={{
                elements: {
                    formButtonPrimary: 'bg-luxury-gold hover:bg-yellow-600 text-black font-bold',
                    card: 'bg-zinc-900 border border-white/10'
                }
            }} />
        </div>
    );
}

import { Link } from '@inertiajs/react';
import '../../css/dashboard.css';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <nav className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-green-400 transition">
                        <span className="text-2xl">☕</span>
                        <span className="font-bold text-xl">XpressUTC</span>
                    </Link>
                </div>
            </nav>
            <main className="py-12">
                {children}
            </main>
        </div>
    );
}

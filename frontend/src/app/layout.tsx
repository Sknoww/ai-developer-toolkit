import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AI Developer Toolkit',
    description:
        'AI-powered API documentation generator for modern development teams',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    inter.className
                )}
            >
                <div className='relative flex min-h-screen flex-col'>
                    <div className='flex-1'>{children}</div>
                </div>
            </body>
        </html>
    );
}

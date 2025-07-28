import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-14 items-center max-w-screen-2xl mx-auto px-4'>
                <div className='mr-4 flex'>
                    <Link href='/' className='mr-6 flex items-center space-x-2'>
                        <Zap className='h-6 w-6' />
                        <span className='font-bold'>AI Developer Toolkit</span>
                    </Link>
                </div>
                <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
                    <nav className='flex items-center space-x-6 text-sm font-medium'>
                        <Link
                            href='/'
                            className='transition-colors hover:text-foreground/80 text-foreground'
                        >
                            Generator
                        </Link>
                        <Link
                            href='/docs'
                            className='transition-colors hover:text-foreground/80 text-foreground/60'
                        >
                            Documentation
                        </Link>
                        <Link
                            href='/projects'
                            className='transition-colors hover:text-foreground/80 text-foreground/60'
                        >
                            Projects
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

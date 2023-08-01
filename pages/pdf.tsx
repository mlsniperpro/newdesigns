// Import React components
import { Toaster } from 'react-hot-toast';

import { Chat } from '@/components/PDF/components/chat';
import { Header } from '@/components/PDF/components/header';
import { Providers } from '@/components/PDF/components/providers';
import { TailwindIndicator } from '@/components/PDF/components/tailwind-indicator';
// Import utilities
import { fontMono, fontSans } from '@/components/PDF/lib/fonts';
import { nanoid } from '@/components/PDF/lib/utils';
import { cn } from '@/components/PDF/lib/utils';

interface RootLayoutProps {
  children: React.ReactNode;
}

// RootLayout component
export default function RootLayout({ children }: RootLayoutProps) {
  // Generate a unique id
  const id = nanoid();

  return (
    <>
      <Toaster />
      <Providers attribute="class" defaultTheme="system" enableSystem>
        <div
          className={cn(
            'flex flex-col min-h-screen font-sans antialiased',
            fontSans.variable,
            fontMono.variable,
          )}
        >
          <Header />
          <Chat id={id} />
          <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
        </div>
        <TailwindIndicator />
      </Providers>
    </>
  );
}

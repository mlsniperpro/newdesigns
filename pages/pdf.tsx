import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components//PDF/components/providers';
import { TailwindIndicator } from '@/components//PDF/components/tailwind-indicator';
import { Chat } from '@/components/PDF/components/chat';
import { Header } from '@/components/PDF/components/header';
import { fontMono, fontSans } from '@/components/PDF/lib/fonts';
// Import Chat component
import { nanoid } from '@/components/PDF/lib/utils';
import { cn } from '@/components/PDF/lib/utils';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const id = nanoid();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Toaster />
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Chat id={id} />
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
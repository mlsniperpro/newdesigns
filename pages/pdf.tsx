// Import React components
import { useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';



import useSubscription  from '@/hooks/useSubscription';



import { Chat } from '@/components/PDF/components/chat';
import { Header } from '@/components/PDF/components/header';
import { Providers } from '@/components/PDF/components/providers';
import { TailwindIndicator } from '@/components/PDF/components/tailwind-indicator';
// Import utilities
import { fontMono, fontSans } from '@/components/PDF/lib/fonts';
import { nanoid } from '@/components/PDF/lib/utils';
import { cn } from '@/components/PDF/lib/utils';



import { auth } from '@/config/firebase';


interface RootLayoutProps {
  children: React.ReactNode;
}

// RootLayout component
export default function RootLayout({ children }: RootLayoutProps) {
  // Generate a unique id
  const router = useRouter();
  const id = nanoid();
  const [user, userLoading] = useAuthState(auth);
  const {subscribed, loading} = useSubscription(user);
  /*
  useEffect(() => {
    if (!subscribed && !loading && user) {
      router.push('/');
    }
  }, [loading, userLoading]);
  */
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
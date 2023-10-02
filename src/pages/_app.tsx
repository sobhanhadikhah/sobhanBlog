import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import '@radix-ui/themes/styles.css';
import Navbar from '~/components/layout/navbar';
import { Toaster } from 'react-hot-toast';
import Sky from '~/components/sky';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Sky>
        <main className="mx-auto max-w-[1240px]">
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </main>
      </Sky>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

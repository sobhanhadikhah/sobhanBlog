/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppProps, type AppType } from 'next/app';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import '@radix-ui/themes/styles.css';
import Navbar from '~/components/layout/navbar';
import { Toaster } from 'react-hot-toast';

import Sky from '~/components/sky';
import { type ReactElement, type ReactNode } from 'react';
import { type NextPage } from 'next';
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <Sky>
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </Sky>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

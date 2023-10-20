/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { signIn, useSession } from 'next-auth/react';
import { type ReactNode } from 'react';
import Cart from '~/components/elemnt/cart';
import { ProtectedLayout } from '~/components/layout/protectedLayouts/protectedLayouts';
import { api } from '~/utils/api';


export default function Page(){
  const {status} = useSession();
  const {data,refetch} = api.post.getFavorite.useQuery({limit:30});
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }
  return (<div className='max-w-7xl mx-auto h-full ' >
        <div className='grid grid-cols-12 gap-2' >
            {
              data?.data.map((item)=> <Cart key={item.id} {...item.post} refetch={refetch} />)
            }
        </div>
  </div>);
};

Page.getLayout = function getLayout(page: ReactNode) {
  return <ProtectedLayout>{page}</ProtectedLayout>;
};


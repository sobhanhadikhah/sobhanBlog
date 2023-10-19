/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { type NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Cart from '~/components/elemnt/cart';
import { api } from '~/utils/api';


const Page: NextPage = () => {
  const {status} = useSession();
  const {data,refetch} = api.post.getFavorite.useQuery({limit:30});
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }
  return (<div>
        <div>
            
            {
              data?.data.map((item)=> <Cart key={item.id} {...item.post} refetch={refetch} />)
            }
        </div>
  </div>);
};

export default Page;

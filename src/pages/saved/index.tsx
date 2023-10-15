/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { type NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';


const Page: NextPage = () => {
  const {status} = useSession();
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }
  return (<div>
        <h1>
            Reading List
        </h1>
  </div>);
};

export default Page;

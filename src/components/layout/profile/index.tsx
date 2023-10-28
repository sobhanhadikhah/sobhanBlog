/* eslint-disable prettier/prettier */
import { CaretLeft } from '@phosphor-icons/react';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

import { Toaster } from 'react-hot-toast';

interface Props {
    children:ReactNode
    userName:string
}

const ProfileLayout: NextPage<Props> = ({children,userName}) => {
  const router = useRouter();
  return (
    <>
      <div className='sticky items-center bottom-0 w-full bg-purple-600 h-[58px] flex ' >
          <button type='button' onClick={()=>router.back()} >
          <CaretLeft size={36} />
          </button>
          <span>
            {userName}
          </span>
          
      </div>
        <main
          className=" mx-auto max-w-7xl overflow-hidden ">
          {children}
          <Toaster />
        </main>
    </>
  )
};

export default ProfileLayout;

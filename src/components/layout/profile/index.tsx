/* eslint-disable prettier/prettier */
import { type NextPage } from 'next';
import { type ReactNode } from 'react';

import { Toaster } from 'react-hot-toast';

interface Props {
    children:ReactNode
}

const ProfileLayout: NextPage<Props> = ({children}) => {
  return (
    <>
      <div className='sticky items-center bottom-0 w-full bg-purple-600 h-[58px] flex justify-between' >
          <span>
            {`<`}
          </span>
          <span>
            Profile
          </span>
          <span>
            menu
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

/* eslint-disable prettier/prettier */
import { type NextPage } from 'next';
import { type MouseEventHandler, type ReactNode } from 'react';

import { Toaster } from 'react-hot-toast';
import Button from '~/components/elemnt/button';

interface Props {
    children:ReactNode,
    createPost: MouseEventHandler<HTMLButtonElement>
}

const CreatePostLayout: NextPage<Props> = ({children,createPost}) => {
  return (
    <>
      
        <main
          className=" mx-auto max-w-7xl overflow-hidden ">
          {children}
          <Toaster />
        </main>
        <div className='sticky items-center gap-3 bottom-0 w-full bg-[#171717] h-[58px] flex justify-between' >
          <Button className='bg-purple-500 mx-3 font-bold rounded-md text-lg ' type='button' onClick={createPost} >
            Publish
          </Button>
      </div>
    </>
  )
};

export default CreatePostLayout;

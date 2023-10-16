/* eslint-disable prettier/prettier */
import { type NextPage } from 'next';
import { type ReactNode } from 'react';
import Navbar from '../layout/navbar';
import { Toaster } from 'react-hot-toast';

interface Props {
    children:ReactNode
}

const MainLayout: NextPage<Props> = ({children}) => {
  return (
    <>
    <Navbar />
        <main
          style={{ scrollBehavior: 'smooth' }}
          className=" mx-auto   max-w-7xl overflow-auto py-2  ">
          {children}
          <Toaster />
        </main>
    </>
  )
};

export default MainLayout;

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
          className=" mx-auto max-w-7xl">
          {children}
          <Toaster />
        </main>
    </>
  )
};

export default MainLayout;

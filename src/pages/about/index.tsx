/* eslint-disable prettier/prettier */
import { type ReactNode } from 'react';
import MainLayout from '~/components/layouts/main';

export default function About(){
  return (
    <div className='h-full' > 
      <div className='grid place-content-center items-center justify-center text-center' >
      <div className='flex gap-1 ' >
      <h2>Hey My Name is </h2>
      <h1>sobhan hadikhah</h1>
      </div>
      </div>
    </div>
  )
};

About.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};


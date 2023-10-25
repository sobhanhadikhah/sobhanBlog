/* eslint-disable prettier/prettier */
import { type ReactNode } from 'react';

/* eslint-disable prettier/prettier */
interface Props {
    children:ReactNode
}
function ProfileLayout({children}:Props) {
  return <>
    <div className='w-full p-3 sticky top-0  !overflow-hidden z-50  mx-auto  bg-purple-800 ' >
                <h2 className='text-xl' >Profile</h2>     
            </div>
            <div   className='overflow-hidden ' >
            {children}
            </div>
  </>;
}

export default ProfileLayout;

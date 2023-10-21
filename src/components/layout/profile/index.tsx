/* eslint-disable prettier/prettier */
import { type ReactNode } from 'react';

/* eslint-disable prettier/prettier */
interface Props {
    children:ReactNode
}
function ProfileLayout({children}:Props) {
  return <div>
    <div className='w-full p-3  z-50  mx-auto  bg-purple-800 ' >
                <h2 className='text-xl' >Profile</h2>     
            </div>
            {children}
  </div>;
}

export default ProfileLayout;

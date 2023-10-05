import { Lightbulb, LightbulbFilament } from '@phosphor-icons/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useOutsideClick } from '~/hook/useOutsideClick';
import { api } from '~/utils/api';

function Navbar() {
  const { data: sessionData } = useSession();
  const id = typeof sessionData?.user.id === 'string' ? sessionData.user.id : '';
  const { data: dataUser, isLoading } = api.user.userInfo.useQuery({ id: id });
  const Profile = sessionData?.user.image;
  const [toggle, setToggle] = useState(false);

  const sidebarRef = useRef(null);

  // Close the sidebar when clicking outside of it
  useOutsideClick(sidebarRef, () => {
    setToggle(false);
  });

  return (
    <nav className="sticky top-0 z-50  flex flex-row items-center justify-between gap-3 bg-black  p-5">
      <div className="items-center">
        <Link href={'/'}>
          <LightbulbFilament size={36} className="hover:text-yellow-300" />
        </Link>
      </div>
      <div>
        {sessionData ? (
          <>
            <Image
              onClick={() => setToggle((prev) => !prev)}
              className="cursor-pointer rounded-full"
              src={Profile!}
              alt="profile"
              width={28}
              height={28}
            />
            {toggle ? (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-70 lg:absolute lg:bg-opacity-0 lg:bg-none">
                {/* Black background with opacity */}
                <div
                  ref={sidebarRef}
                  className="absolute right-5 top-14 z-50 flex w-[200px] flex-col justify-between gap-5 rounded-2xl bg-gray-950 p-5 shadow-md">
                  <span className="text-green-500">
                    @ {sessionData ? sessionData.user.name : null}
                  </span>
                  {dataUser?.user?.role === 'ADMIN' ? (
                    <>
                      <Link onClick={() => setToggle(false)} href={'/post/create'}>
                        Create post
                      </Link>
                      <Link onClick={() => setToggle(false)} href={'/dashboard'}>
                        Dashboard
                      </Link>
                    </>
                  ) : null}
                  <Link onClick={() => setToggle(false)} href={'/about'}>
                    About
                  </Link>
                  <button type="button" onClick={() => void signOut()} className="text-red-500">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
        {!sessionData && !isLoading ? (
          <button onClick={() => void signIn()} type="button">
            Login
          </button>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useOutsideClick } from "~/hook/useOutsideClick";

function Navbar() {
  const { data: sessionData } = useSession();
  const Profile = sessionData?.user.image;
  const [toggle, setToggle] = useState(false);

  const sidebarRef = useRef(null);

  // Close the sidebar when clicking outside of it
  useOutsideClick(sidebarRef, () => {
    setToggle(false);
  });

  return (
    <nav className="flex sticky top-0 flex-row justify-between items-center gap-3 p-5">
      <div>
        <Link href={"/"}>iBlog</Link>
      </div>
      <div>
        {sessionData ? (
          <>
            <Image
              onClick={() => setToggle((prev) => !prev)}
              className="rounded-full cursor-pointer"
              src={Profile!}
              alt="profile"
              width={28}
              height={28}
            />
            {toggle ? (
                <div className="fixed lg:absolute inset-0 bg-black lg:bg-none bg-opacity-70 lg:bg-opacity-0 z-50">
                  {/* Black background with opacity */}
                <div
                  ref={sidebarRef}
                  className="w-[200px] p-5 shadow-md flex gap-5 flex-col justify-between absolute top-14 right-5 bg-gray-950 rounded-2xl z-50"
                >
                  <span onClick={()=>setToggle(false)} className="text-green-500">
                    @ {sessionData ? sessionData.user.name : null}
                  </span>
                  <Link href={"/post/create"}>Create post</Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <button onClick={() => void signIn()} type="button">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

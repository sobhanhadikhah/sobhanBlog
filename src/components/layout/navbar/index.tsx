import { LightbulbFilament, MagnifyingGlass } from '@phosphor-icons/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { useOutsideClick } from '~/hook/useOutsideClick';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
function Navbar() {
  const { data: sessionData, status } = useSession();
  const authorized = status === 'authenticated';
  const unAuthorized = status === 'unauthenticated';
  //  const loading = status === 'loading';
  const Profile = sessionData?.user.image;
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const [query, setQuery] = useState(router.query.query ?? '');
  useEffect(() => {
    return setQuery(router.query.query ?? '');
  }, [router.query]);
  useOutsideClick(sidebarRef, () => {
    setToggle(false);
  });

  async function handleSignOut() {
    await router.push('/');
    await signOut();
  }
  async function handleSearchPush(e: FormEvent) {
    e.preventDefault();
    if (query) {
      await router.push({ pathname: '/search', query: { query: query } });
    } else {
      return;
    }
  }
  return (
    <>
      <nav className=" sticky top-0 z-[500] mx-auto w-full   border-b border-black bg-[#171717] ">
        <div className="mx-auto  flex max-w-7xl flex-row items-center justify-between gap-3 px-3 py-3 ">
          <div className="flex  items-center gap-3 ">
            <Link href={'/'}>
              <LightbulbFilament size={36} className="hover:text-yellow-300" />
            </Link>
            <form
              onSubmit={(e) => void handleSearchPush(e)}
              className="relative  hidden items-center md:flex ">
              <input
                placeholder="Search..."
                className=" rounded-md border-none bg-transparent px-2 py-2 text-white ring-1 ring-white focus:outline-none focus:outline-2   focus:ring-purple-500 "
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 ">
                <MagnifyingGlass size={26} />
              </button>
            </form>
          </div>
          <div>
            {authorized ? (
              <div className="flex items-center gap-3 ">
                <button
                  onClick={() =>
                    void (router.pathname === '/search' ? null : router.push('/search'))
                  }
                  type="button"
                  className="block md:hidden">
                  <MagnifyingGlass size={26} />
                </button>
                <Link
                  className="hidden rounded-sm px-3 py-2 font-semibold ring-2 ring-white hover:bg-white hover:text-black md:flex "
                  href={'/post/create'}>
                  Create Post
                </Link>
                <Image
                  onClick={() => setToggle((prev) => !prev)}
                  className="cursor-pointer rounded-full"
                  src={Profile!}
                  alt="profile"
                  width={40}
                  height={40}
                />
                {toggle ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: '0.2' }}
                      exit={{ opacity: 1 }}
                      className="fixed inset-0 z-50 bg-black bg-opacity-70 lg:absolute lg:bg-opacity-0 lg:bg-none">
                      {/* Black background with opacity */}
                      <div
                        ref={sidebarRef}
                        className="absolute right-5 top-14 z-50 flex w-[200px] flex-col justify-between gap-5 rounded-2xl bg-[#1f1f1f] p-5 shadow-md">
                        <span className="text-green-500">
                          @{sessionData ? sessionData.user.name : null}
                        </span>
                        <div className="border-b" />
                        <Link onClick={() => setToggle(false)} href={'/dashboard'}>
                          Dashboard
                        </Link>
                        <Link onClick={() => setToggle(false)} href={'/post/create'}>
                          Create Post
                        </Link>
                        <Link onClick={() => setToggle(false)} href={'/saved'}>
                          Reading list
                        </Link>
                        <div className="border-b" />
                        <button
                          type="button"
                          onClick={() => void handleSignOut()}
                          className="text-red-500">
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : null}
              </div>
            ) : null}
            {unAuthorized ? (
              <button onClick={() => void signIn()} type="button">
                Log in
              </button>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

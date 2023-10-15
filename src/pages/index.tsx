/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Head from 'next/head';
import Cart from '~/components/elemnt/cart';
import { api } from '~/utils/api';
import { useState } from 'react';
import { type Post } from '~/types/post/index.';
import { useInView } from 'react-intersection-observer';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Link from 'next/link';

export default function Home() {
  const { ref } = useInView({
    onChange(inView) {
      if (inView && page < totalPage - 1) {
        handleFetchNextPage();
      }
    },
  });
  const [sort] = useState('');
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const { refetch, isLoading, fetchNextPage } = api.post.getAll.useInfiniteQuery(
    {
      limit: 10,
      order: sort || undefined,
    },
    {
      staleTime: 0,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        if (Math.ceil(lastPage.count / 10) > pages.length) return lastPage.nextCursor;
        return undefined;
      },
      onSuccess(data) {
        //@ts-ignore
        setPosts((prev) => [...prev, ...data?.pages[page]?.posts]);
        setTotalPage(data?.pages[page]?.totalPages ?? 0);
      },
    },
  );

  const handleFetchNextPage = async () => {
    console.log('from fetch start', page);
    setPage((prev) => prev + 1);
    await fetchNextPage();
    console.log('from fetch end', page);
  };

  /* const sortButtons = [
    {
      id: 'latestId',
      value: '',
      label: 'Latest',
    },
    {
      id: 'likeId',
      value: 'like',
      label: 'Top',
    },
  ]; */

  const { data: tagsData, isLoading: isLoadingTags } = api.tag.getAllTag.useQuery();

  return (
    <>
      <Head>
        <title>iBlog</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-12 gap-3 rounded-sm ">
        {/* tags */}
        <div className="col-span-3 hidden flex-col md:flex ">
          <div className="z-[500] flex max-h-[800px] min-h-[400px] flex-col  gap-3 overflow-auto bg-black p-3 ">
            <div>
              <h2 className="text-lg font-semibold">Tags</h2>
            </div>
            {isLoadingTags
              ? Array(6)
                  .fill('id')
                  .map((item, index) => (
                    <SkeletonTheme
                      key={`skeleton${index}`}
                      height={411}
                      baseColor="#202020"
                      highlightColor="#444">
                      <Skeleton height={10} width={200} />
                    </SkeletonTheme>
                  ))
              : tagsData?.map((item) => (
                  <Link
                    href={`/t/${item.id}`}
                    key={item.id}
                    className="justify between flex w-full rounded-md p-1 px-3 text-gray-100  transition-all duration-150 hover:bg-[#1f1f1f]">
                    {item.label} <span>{item._count.posts}</span>
                  </Link>
                ))}
          </div>
        </div>
        <main className="col-span-12 grid grid-cols-12 items-start   gap-y-2 md:col-span-7">
          {/* sort */}
          <div className="col-span-12 flex    gap-5  px-3 py-3 text-2xl">
            {/* {sortButtons.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.value !== sort) {
                    setPosts([]);
                    setSort(item.value);
                    setPage(0);
                    console.log('from sort', page);
                  }
                }}
                className={`${item.value === sort ? 'font-bold text-white' : 'text-white/75'}`}>
                {item.label}
              </button>
            ))} */}
          </div>
          {/* posts */}
          {!isLoading
            ? posts.map((item) => <Cart refetch={refetch} key={item.id} {...item} />)
            : Array(6)
                .fill('id')
                .map((item, index) => (
                  <SkeletonTheme
                    key={`skeleton${index}`}
                    height={411}
                    baseColor="#202020"
                    highlightColor="#444">
                    <div className="z-50 col-span-12 h-full rounded-none bg-[#171717] px-3 md:rounded-md">
                      <div className="flex flex-col ">
                        {/* profile auth */}
                        <div className="flex items-center gap-3 text-black dark:text-white ">
                          <div className="flex items-center space-x-3">
                            <div className="group flex items-center gap-1 ">
                              <Skeleton width={32} height={32} style={{ borderRadius: '100%' }} />
                              <div className="flex flex-col items-center gap-1 ">
                                <Skeleton width={100} height={5} />
                                <Skeleton width={100} height={5} />
                              </div>
                            </div>
                          </div>
                          <h4 className="py-3 font-sans text-sm font-bold "></h4>
                          <span className="text-blue-400"> </span>
                        </div>
                        {/* main data */}
                        <div className="dark flex w-full flex-col justify-center ">
                          <h1 className="py-2 text-lg font-extrabold lg:text-xl ">
                            <Skeleton height={8} />
                          </h1>
                          <p className="text-sm font-light leading-relaxed text-gray-400 lg:text-base ">
                            <Skeleton count={3} height={4} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </SkeletonTheme>
                ))}
          {!isLoading && totalPage !== page ? (
            <div
              className="col-span-1 flex items-center justify-center p-4 py-3 sm:col-span-2 md:col-span-3"
              ref={ref}
            />
          ) : null}
        </main>
        {/* banner */}
        <div className="col-span-2 hidden md:flex">banner</div>
      </div>
    </>
  );
}

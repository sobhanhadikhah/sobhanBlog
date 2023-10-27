/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { signIn, useSession } from 'next-auth/react';
import { useState, type ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import Cart from '~/components/elemnt/cart';
import { ProtectedLayout } from '~/components/layout/protectedLayouts/protectedLayouts';
import { api } from '~/utils/api';


export default function Page(){
  const {status} = useSession();
  const [page, setPage] = useState(0);
const [totalPage, setTotalPage] = useState(0);
  const {data,refetch,fetchNextPage,isLoading} = api.post.getFavorite.useInfiniteQuery({limit:30},
    {
      queryKey: ['post.getFavorite', { limit: 30,}],
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        if (Math.ceil(lastPage.count / 30) > pages.length) return lastPage.nextCursor;
        return undefined;
      },
      onSuccess(data) {
        setTotalPage(data?.pages[page]?.totalPages ?? 0);
      },
    },);
  const { ref } =  useInView({
    onChange(inView) {
     if (inView && page < totalPage - 1) {
       void handleFetchNextPage();
     }
   },
 });
//@ts-ignore
const posts: Post[] = data?.pages.reduce((acc, page) => {
  return [...acc, ...page.posts];
}, []);
const handleFetchNextPage = async () => {
  
  setPage((prev) => prev + 1);

  // Define the query key for the new page

  // Invalidate the cache for the next page

 await fetchNextPage();

  
};
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }
  return (<div className='max-w-7xl mx-auto ' >
        <div className='col-span-12  w-full  grid h-full grid-cols-12 items-start gap-y-2  overflow-auto md:col-span-8 ' >
            {
              posts?.map((item)=> <Cart key={item.id} {...item.post} refetch={refetch} />)
            }
        </div>
        {!isLoading && totalPage !== page ? (
            <div
              className="col-span-1 flex items-center justify-center p-4 py-3 sm:col-span-2 md:col-span-3"
              ref={ref}
            />
          ) : null}
  </div>);
};

Page.getLayout = function getLayout(page: ReactNode) {
  return <ProtectedLayout>{page}</ProtectedLayout>;
};


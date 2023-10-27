/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { type Post } from '@prisma/client';
import { useRouter } from 'next/router';
import { type ReactNode, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Button from '~/components/elemnt/button';
import Cart from '~/components/elemnt/cart';
import MainLayout from '~/components/layouts/main';
import { api } from '~/utils/api';


export default function ShowingTag(){
    const {query} = useRouter();
    const { ref } =  useInView({
       onChange(inView) {
        if (inView && page < totalPage - 1) {
          void handleFetchNextPage();
        }
      },
    });
    const [sort, setSort] = useState('');
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const id = typeof query.id === 'string' ? query.id : '';
  const {data:tagInfo} = api.tag.tagInfoById.useQuery({id})

    const {data,refetch,fetchNextPage,isLoading} = api.tag.postByTag.useInfiniteQuery(
      {
        limit: 30,
        order: sort || undefined,
        id
      },
      {
        queryKey: ['tag.postByTag', { limit: 30, order: sort || undefined,id }],
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
          if (Math.ceil(lastPage.count / 30) > pages.length) return lastPage.nextCursor;
          return undefined;
        },
        onSuccess(data) {
          setTotalPage(data?.pages[page]?.totalPages ?? 0);
        },
      },
    );
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

  const sortButtons = [
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
  ];
  return (
    <>
    <div className='bg-[#171717]  w-full gap-3 my-3 md:rounded-lg p-3 rounded-none flex flex-col ' >
      <div className='flex items-center justify-between w-full' >
      <h1 className='text-3xl font-bold' >
        #
        {
          tagInfo?.label
        }
      </h1>
      <Button className='bg-purple-600 rounded-md font-bold' >
        Fallow
      </Button>
      </div>
      <div>
        <p className='text-sm text-gray-400' >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et harum dignissimos enim tempore neque similique error sint placeat ipsa cum?
        </p>
      </div>
    </div>
    <div className='col-span-12 grid h-full grid-cols-12 items-start gap-y-2  overflow-auto md:col-span-7" ' >
    {/* sort */}
    <div className="col-span-12 flex    gap-5  px-3 py-3 text-2xl">
            {sortButtons.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.value !== sort) {
                    setSort(item.value);
                    setPage(0);
                    console.log('from sort', page);
                  }
                }}
                className={`${item.value === sort ? 'font-bold text-white' : 'text-white/75'}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className='col-span-12  w-full  grid h-full grid-cols-12 items-start gap-y-2  overflow-auto md:col-span-8 ' >
            {              
                posts?.map((item)=><Cart  key={item.id} {...item} refetch={refetch} />)
              }
              </div>
              <span className='col-span-4' >
                banner
              </span>
            {!isLoading && totalPage !== page ? (
            <div
              className="col-span-1 flex items-center justify-center p-4 py-3 sm:col-span-2 md:col-span-3"
              ref={ref}
            />
          ) : null}
    </div>
    </>
  )
};

ShowingTag.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

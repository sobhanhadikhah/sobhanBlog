/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import { type ReactNode, useState, useEffect, type FormEvent } from 'react';
import Cart from '~/components/elemnt/cart';
import MainLayout from '~/components/layouts/main';
import SkeletonLoading from '~/components/skeletonLoading';
import { api } from '~/utils/api';



export default  function SearchPage({}) {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.query ?? "" );
const [value, setValue] = useState(router.query.query ?? "" );
  const { data, mutate,isLoading } = api.post.search.useMutation({
    onSuccess(data) {
      console.log(data);
    },
  });
  function Search() {
    if (query) {
    const data =  query.toString();
      mutate({query:data.toLowerCase()})
    }
  }
  useEffect(()=>{
    setQuery(router.query.query ?? "");
    setValue(router.query.query ?? "" );
  },[router.query]);
  useEffect(()=>{
    Search();
  },[query]);
 async function handleSearch(e:FormEvent){
    e.preventDefault();
  if (value) { 
    await router.push({query:{query:value}})
  }
  }
  return (
    <div className='grid grid-cols-12 w-full gap-2 ' >
      <form onSubmit={(e)=> void  handleSearch(e)} className='relative col-span-12 w-full p-3 md:hidden items-center ' >
      <input type="text" value={value} onChange={(e)=> setValue(e.target.value)}
        className='w-full border-none outline-none focus:outline-none rounded-md bg-[#171717] px-3 py-2 ' placeholder='search...'  />
      <button  type="submit" className="absolute right-5 top-5  ">
                <MagnifyingGlass size={26} color='white' />
              </button>
      </form>
      <div className='col-span-12 w-full hidden md:block py-5 ' >
        <h2 className='text-3xl font-bold' >
        Search results for {query}
        </h2>
      </div>
      <div className='col-span-12 md:col-span-4 mx-3 hidden md:block' >
          <button className='flex w-full font-bold justify-between gap-3 rounded-md p-1 px-3 text-gray-100  transition-all duration-150 bg-[#1f1f1f]' >
            Post
          </button>
      </div>
      <div className=' grid grid-cols-12 items-center col-span-12 md:col-span-8 h-full gap-2' >
        { !isLoading ?
          data?.result.map((item)=> <Cart key={item.id} {...item} />)
          : Array(6).fill("").map((n,i)=><SkeletonLoading key={i} />)
        } 
        {
          !isLoading && !data?.result.length && query ? <span className='text-xl col-span-12 text-center animate-pulse ' >its Empty here </span> : null
        }
        {
          !isLoading && !data?.result.length && !query ? <span className='text-xl col-span-12 text-center animate-pulse ' >Search in Title and Tags </span> : null
        }    
        </div>
    </div>
  )
};
SearchPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};



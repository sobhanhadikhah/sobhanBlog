/* eslint-disable prettier/prettier */
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Cart from '~/components/elemnt/cart';
import Loading from '~/components/elemnt/loading';
import ProfileLayout from '~/components/layout/profile';
import { api } from '~/utils/api';
/* eslint-disable prettier/prettier */
export default function UserInfo() {
  const {data:sessionData} = useSession();
    const id = typeof sessionData?.user.id === 'string' ? sessionData?.user.id : '';
    const {data,isInitialLoading,refetch} = api.user.userInfoProfile.useQuery({id});
    if (isInitialLoading) {
      return <Loading/>
    }
  return (
    <>
    <ProfileLayout userName={data?.user?.name ?? ""} >

    
            <div className='flex items-center flex-col gap-5  justify-center mt-10 ' >
                <Image src={data?.user?.image ?? ""}
                 alt='profile'
                  width={68} height={68}
                   className='rounded-full z-50 ring-2 ring-purple-500 w-[128px] ' />
                    <button type='button' className='font-bold' >
                      Edit Profile
                    </button>
                    <div className='flex gap-3 justify-between items-center ' >
                        <span className='bg-white rounded-full font-bold text-purple-500 p-1 px-2 items-center' > Posts: {data?.user?._count.posts}</span>
                        <span className='bg-white rounded-full font-bold text-purple-500 p-1 px-2 items-center' > Reading List: {data?.user?._count.favorite}</span>
                        <span className='bg-white rounded-full font-bold text-purple-500 p-1 px-2 items-center' > Comments: {data?.user?._count.comment}</span>
                    </div>
            </div>
            {/* i want render my cart here */}
            <div 
            style={{height:"calc(100vh - 323px)"}}
            className='max-w-5xl p-3 w-full  items-center gap-3 rounded-lg mx-auto  grid overflow-auto ' >
                  {
                    data?.user?.posts.map((item)=> <Cart isDeletable key={item.id} {...item} refetch={refetch} />)
                  }
            </div>
            </ProfileLayout>            
    </>
  )
}

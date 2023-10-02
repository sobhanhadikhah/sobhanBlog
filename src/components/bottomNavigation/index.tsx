/* eslint-disable prettier/prettier */
import { ChatCircle, Heart,  ShareNetwork } from '@phosphor-icons/react';
import { type NextPage } from 'next';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';


type Props ={
  id: string
}
const BottomNavigation: NextPage<Props> = ({id}) => {
  const Like = api.post.likePost.useMutation({
    onSuccess(){
      toast.success("like",{id:"like",position:"bottom-center"})
    }
  })  
  function handleLike(id:string){
    toast.loading("liking...",{id:"like",position:"bottom-center"})
    Like.mutate({id})
  }
  return  (
    <>
  <div className="fixed bottom-12 z-50 left-10 right-10 block  rounded-full  bg-slate-700  shadow-sm    ">
  <div className="  flex  w-full items-center  justify-around gap-5 p-3  ">
    <span onClick={()=>handleLike(id)} >
      <Heart size={28}   />
    </span>
    <span  >
      <ChatCircle size={28} />
    </span>
    <span>
      <ShareNetwork size={28} />
    </span>
  </div>
</div>
<div className='fixed bottom-0 bg-gradient-to-b from-black   to-white bg-opacity-50 w-full z-20 h-[110px] block
 md:hidden opacity-60 ' />

  </>
    

);
};

export default BottomNavigation;

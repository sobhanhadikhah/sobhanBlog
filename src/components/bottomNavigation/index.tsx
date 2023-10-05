/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { BookmarkSimple, ChatCircle, Heart } from '@phosphor-icons/react';
import { type NextPage } from 'next';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';
import Share from '../buttonShare';
import * as Tooltip from '@radix-ui/react-tooltip';
import ToolTip from '../toolTip';
import Link from 'next/link';
interface likes {
  id:string,
  postId:string,
  userId:string,
  likedAt:Date
}
interface Comment {
  id:string,
  postId:string,
  userId:string,
  commentAt:Date,
  text:string
}
type Props ={
  likes:likes[] | undefined
  postId: string,
  Comment: Comment[] | undefined
  userId:string,
  refetchPost: CallableFunction
}
const BottomNavigation: NextPage<Props> = ({userId,postId,likes,refetchPost,Comment}) => {
  const Like = api.post.likePost.useMutation({
    onSuccess(){
      toast.success("like",{id:"like",position:"bottom-center"})
      refetch();
      refetchPost()
    }
  }) ;
  const {data,refetch} = api.post.isUserLike.useQuery({userId:userId,postId:postId}); 
  function handleLike(postId:string,userId:string){
    toast.loading("liking...",{id:"like",position:"bottom-center"})
    Like.mutate({userId:userId , postId:postId})
  }
  
  
  return  (
    <>
  <div className="fixed bottom-12 max-w-2xl mx-auto  z-30 left-10 right-10 block  rounded-full  bg-black  shadow-sm    ">
  <div className="  flex  w-full items-center  justify-around gap-5 p-3  ">
    
    <ToolTip content='like' >
    <button type='button' disabled={Like.isLoading} className='flex gap-2' onClick={()=>handleLike(postId,userId)} >
     {likes?.length} <Heart color='red' size={28} weight={data?.isLike ? "fill" : "regular"}  />
    </button>
    </ToolTip>
    
    <Link href={"#commentSection"} scroll={false}  className='flex gap-2' >
      {Comment?.length}
      <ChatCircle size={28} />
    </Link>
    <button type='button' >
    <BookmarkSimple size={36}  />
    </button>
    <Share title='hello' content='velo' />
    
  </div>
</div>
<div className='fixed bottom-0 bg-gradient-to-b from-black   to-white bg-opacity-50 w-full z-20 h-[110px] block
 md:hidden opacity-60 ' />
</>
);
};

export default BottomNavigation;

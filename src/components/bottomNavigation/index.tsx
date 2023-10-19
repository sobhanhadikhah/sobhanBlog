/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { BookmarkSimple, ChatCircle, Heart } from '@phosphor-icons/react';
import { type NextPage } from 'next';
import { api } from '~/utils/api';
import Share from '../buttonShare';
import ToolTip from '../toolTip';
import Link from 'next/link';
import { useState } from 'react';
import { type _count } from '~/types/post/index.';
import { type Favorite } from '~/types/post/index.';
import { useSession } from 'next-auth/react';
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
  _count : _count | undefined,
  favorite: Favorite[] | undefined
  
}
const BottomNavigation: NextPage<Props> = ({userId,postId,refetchPost,_count,favorite}) => {
  const [isLike, setIsLike] = useState(false);
  const {data:userData} = useSession();
  const [likeCount, setLikeCount] = useState(_count?.like ?? 0)
  const [isSaved, setIsSaved] = useState(!!favorite?.length);
  const Like = api.post.likePost.useMutation({
    onSuccess(){
      
      refetch();
      refetchPost()
    },
    onError(){
      setIsLike((prev)=>(!prev));
      setLikeCount((prev)=>(prev-1))
    }
  }) ;
  const {refetch,data} = api.post.isUserLike.useQuery({postId:postId,userId:userData?.user.id ?? ""},{
    onSuccess(data){
      if (data?.isLike) {
        setIsLike(data?.isLike)
      }
    }
  });
  function handleLike(postId:string) {
    if (isLike) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    Like.mutate({ userId: userData?.user.id ?? "", postId: postId });
  }
  /* favorite section */
  const { isLoading: isLoadingFavorite, mutate: mutateFavorite } = api.post.setFavorite.useMutation(
    {
      onError() {
        setIsSaved((prev) => !prev);
      },
      onSuccess() {
        refetchPost();
      },
    },
  );
  function handleSetFavorite() {
    mutateFavorite({ postId });
  }
  
  return  (
    <>
  <div className="fixed md:bottom-12 bottom-0 md:max-w-2xl  mx-auto  !z-[90000] w-full md:left-10 md:right-10 block  md:rounded-full  bg-black  shadow-sm    ">
  <div className="  flex  w-full items-center  justify-around gap-5 p-3  ">
    
    <ToolTip content='like' >
    <button type='button' disabled={Like.isLoading} className='flex gap-2'
     onClick={()=>{
      setIsLike((prev)=>(!prev))
      handleLike(postId)}
      } >
     {likeCount} <Heart color='red' size={28} weight={isLike ? "fill" : "regular"}  />
    </button>
    </ToolTip>
    <ToolTip content='Jump to Comments' >
    <Link href={"#commentSection"} scroll={false}  className='flex gap-2' >
      {_count?.comment}
      <ChatCircle size={28} />
    </Link>
      </ToolTip>
      <ToolTip content='Save' >

    <button  disabled={isLoadingFavorite} onClick={()=>{
      setIsSaved((prev)=> (!prev))
      handleSetFavorite()
    }}  type='button' className='flex items-center'  >
      {_count?.favorite}
    <BookmarkSimple size={36} weight={isSaved ? "fill" : "regular" }  />
    </button>
      </ToolTip>
      <ToolTip content='Share' >
    <Share title='hello' content='velo' />
      </ToolTip>
    
  </div>
</div>

</>
);
};

export default BottomNavigation;

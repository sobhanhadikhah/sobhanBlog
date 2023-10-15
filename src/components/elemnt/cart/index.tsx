import { type NextPage } from 'next';
import format from 'date-fns/format';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import { TrashSimple, Spinner, BookmarkSimple, Heart, Chat } from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { type _count } from '~/types/post/index.';
import { type User, type Favorite, type Like, type Tag } from '~/types/post/index.';

interface Props {
  title: string;
  id: string;
  content: string;
  createdAt: Date;
  tags?: Tag[] | undefined;
  refetch: CallableFunction;
  user?: User;
  like?: Like[];
  comment?: Comment[];
  favorite?: Favorite[] | undefined;
  _count?: _count;
}

const Cart: NextPage<Props> = ({ title, id, createdAt, tags, refetch, user, favorite, _count }) => {
  const [isSaved, setIsSaved] = useState(!!favorite?.length);
  // Format the date as "MonthName Day, Year"
  const formattedDate = format(createdAt, 'MMMM dd, yyyy');
  const { mutate, isLoading: isLoadingRemove } = api.post.deleteProduct.useMutation({
    onSuccess() {
      refetch();
      toast.success('Ok!', { id: 'postDe' });
    },
    onError() {
      toast.error(`error`, { id: 'postDe' });
    },
  });
  const { isLoading: isLoadingFavorite, mutate: mutateFavorite } = api.post.setFavorite.useMutation(
    {
      onError() {
        setIsSaved((prev) => !prev);
      },
    },
  );
  function deletePostHandle() {
    toast.loading('removing', { id: 'postDe' });
    mutate({ id });
  }
  function handleSetFavorite() {
    mutateFavorite({ postId: id });
  }

  return (
    <div className="z-50 col-span-12 h-full rounded-none bg-[#171717] md:rounded-md  ">
      <div
        key={id}
        className="z-50  mb-auto flex h-full flex-col justify-between gap-3 rounded-lg bg-transparent  p-5   ">
        <div>
          {/* User info */}
          <div className="align-center flex items-center gap-3">
            {user?.image ? (
              <Image
                className="rounded-full"
                src={user?.image}
                alt="profile"
                width={32}
                height={32}
              />
            ) : null}
            <div className="flex flex-col">
              <span className="text-base font-semibold ">{user?.name}</span>
              <span className="text-sm font-thin text-gray-300 ">{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="ml-0 md:ml-10">
          {/* header */}
          <div className="flex items-center justify-between ">
            <Link
              href={`/post/${id}`}
              className="text-xl font-bold  capitalize text-white hover:text-sky-200 md:text-3xl ">
              {title}
            </Link>
            <button disabled={isLoadingRemove} type="button" onClick={deletePostHandle}>
              {isLoadingRemove ? (
                <div className="animate-spin">
                  <Spinner size={36} />
                </div>
              ) : (
                <TrashSimple size={26} className="text-red-400" />
              )}
            </button>
          </div>
          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-3  text-sm">
            {tags?.map((item) => (
              <Link
                href={`t/${item.id}`}
                className="cursor-pointer rounded-md p-1 text-gray-100  transition-all duration-150 hover:bg-[#1f1f1f]"
                key={item.id}
                color="blue">
                #{item.label}
              </Link>
            ))}
          </div>
          {/* buttons */}
          <div className="mt-4 flex items-center justify-between ">
            <div className="flex items-center gap-5">
              {_count?.like ? (
                <Link
                  href={`/post/${id}`}
                  className="flex items-center gap-1 rounded-md p-1  transition-all duration-150 hover:bg-[#1f1f1f]  ">
                  {' '}
                  <Heart size={18} color="red" weight="fill" /> <span>{_count.like}</span>
                </Link>
              ) : null}

              <Link
                href={`post/${id}#commentSection`}
                className="flex items-center gap-1 rounded-md p-1  transition-all duration-150  hover:bg-[#1f1f1f] ">
                {' '}
                <Chat size={18} />{' '}
                <div className="flex items-center gap-1 text-sm ">
                  {_count?.comment ? _count.comment : 'Add'}{' '}
                  <span className="hidden md:block">Comments</span>
                </div>
              </Link>
            </div>
            <button
              disabled={isLoadingFavorite}
              onClick={() => {
                setIsSaved((prev) => !prev);
                handleSetFavorite();
              }}
              type="button"
              className="items-center p-1 transition-all  duration-150 hover:bg-[#1f1f1f] ">
              <BookmarkSimple size={18} weight={isSaved ? 'fill' : 'regular'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import format from 'date-fns/format';
import { api } from '~/utils/api';
import { BookmarkSimple, Heart, Chat } from '@phosphor-icons/react';
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
  refetch?: CallableFunction;
  user?: User;
  like?: Like[];
  comment?: Comment[];
  favorite?: Favorite[] | undefined;
  _count?: _count;
  image: string | null;
}

export default function Cart({ title, id, createdAt, tags, user, favorite, _count, image }: Props) {
  const [isSaved, setIsSaved] = useState(!!favorite?.length);
  // Format the date as "MonthName Day, Year"
  const formattedDate = format(createdAt, 'MMMM dd, yyyy');

  const { isLoading: isLoadingFavorite, mutate: mutateFavorite } = api.post.setFavorite.useMutation(
    {
      onError() {
        setIsSaved((prev) => !prev);
      },
    },
  );

  function handleSetFavorite() {
    mutateFavorite({ postId: id });
  }

  return (
    <div className="z-50 col-span-12  mx-0  rounded-none bg-[#171717] ring-sky-500 hover:ring-2 focus:outline-none md:mx-1 md:rounded-md md:ring-0 ">
      {image ? (
        <div
          style={{ width: '100%' }}
          className="relative col-span-12 aspect-video max-h-[400px]  w-full  ">
          <Image
            loading="lazy"
            blurDataURL="URL"
            placeholder="blur"
            src={`${image}`}
            alt="cover"
            fill
            quality={70}
          />
        </div>
      ) : null}
      <div
        key={id}
        className="z-50  mb-auto flex h-full flex-col justify-between gap-3 rounded-lg bg-transparent  p-5   ">
        {user?.id ? (
          <div>
            {/* User info */}
            <Link href={`/user/info/${user?.id}`} className="align-center flex items-center gap-3">
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
            </Link>
          </div>
        ) : null}
        <div className="ml-0 md:ml-10">
          {/* header */}
          <div className="flex items-center justify-between ">
            <Link
              href={`/post/${id}`}
              className="text-xl font-bold  capitalize text-white hover:text-sky-200 md:text-3xl ">
              {title}
            </Link>
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
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Warning } from '@phosphor-icons/react';
import format from 'date-fns/format';
import { MdPreview } from 'md-editor-rt';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { type ReactNode, useState } from 'react';
import toast from 'react-hot-toast';
import BottomNavigation from '~/components/bottomNavigation';
import { api } from '~/utils/api';
import 'md-editor-rt/lib/preview.css';
import Link from 'next/link';
import Loading from '~/components/elemnt/loading';
import MainLayout from '~/components/layouts/main';
export default function PostInfo() {
  const { query } = useRouter();
  const { status: sessionStatus } = useSession();
  const unAuthorized = sessionStatus === 'unauthenticated';
  const [value, setValue] = useState('');
  const { data: userData } = useSession();
  // Ensure that query.id is a string or provide a default value if it's undefined
  const id = typeof query.id === 'string' ? query.id : '';
  const { mutate, isLoading: isLoadingComment } = api.post.createComment.useMutation({
    onSuccess(data) {
      setValue('');
      toast.success(data.message, { id: 'comment' });
      refetch();
    },
  });
  const { data, isLoading, isError, refetch } = api.post.byId.useQuery({ id });

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <h1>
        <Warning />
      </h1>
    );
  }
  function handleComment(postId: string, text: string, userId: string | undefined) {
    if (text && userId) {
      toast.loading('sending Comment...', { id: 'comment' });
      mutate({ postId, text, userId });
    }
  }
  return (
    <div style={{ scrollBehavior: 'smooth' }} className="mx-auto  max-w-4xl bg-[#171717] ">
      {data.post?.image ? (
        <div
          style={{ width: '100%', height: '100%' }}
          className="relative col-span-12 mt-0 aspect-video w-full md:mt-3  ">
          <Image
            loading="lazy"
            blurDataURL="URL"
            placeholder="blur"
            src={`${data.post?.image}`}
            alt="cover"
            fill
            sizes="100vw"
            quality={70}
            className="rounded-none md:rounded-t-lg "
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : null}
      <main className="p-2 md:p-12">
        {/* userinfo */}
        <div className="!z-[50]   p-3  md:rounded-md  ">
          <div className="flex items-center gap-2  ">
            {data.post?.user.image ? (
              <Image
                src={data.post?.user.image}
                className="rounded-sm"
                alt="name"
                width={40}
                height={40}
              />
            ) : null}

            <div>
              <Link
                href={`/user/info/${data.post?.user.id}`}
                className="font-semibold hover:text-blue-300 ">
                {data.post?.user.name}
              </Link>
              <p className="text-xs text-gray-400 ">
                Posted on{' '}
                {data.post?.createdAt ? format(data.post?.createdAt, 'MMM dd, yyyy') : null}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <h1 className="text-4xl font-bold md:text-7xl ">{data.post?.title}</h1>
          </div>
        </div>

        {/* tags */}
        <div className=" mt-5   ">
          <div className=" flex gap-3  px-3 pt-3 ">
            {data.post?.tags.map((item) => (
              <Link href={`/t/${item.id}`} key={item.id}>
                {' '}
                <span className="text-blue-500">#</span>
                {item.label}
              </Link>
            ))}
          </div>
          {/* content */}
          <MdPreview
            style={{ backgroundColor: '#171717' }}
            showCodeRowNumber
            modelValue={data.post?.content ?? ''}
            theme="dark"
            language="en-US"
          />
        </div>
        {/* comment */}
        <div className=" border-b border-gray-500 " />
        {!unAuthorized ? (
          <div className="mx-3  pt-10 ">
            <div className="flex flex-col gap-5  ">
              <div id="commentSection" className="flex items-center gap-3 ">
                <h2 className="text-3xl">Top comments ({data.post?.comment.length})</h2>
              </div>
              <textarea
                placeholder="Add to the discussion"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                name="comment"
                className="rounded-md border-none bg-[#171717] p-5 text-white focus:outline-none "
              />
              <div>
                <button
                  disabled={isLoadingComment || !value}
                  onClick={() => void handleComment(id, value, userData?.user.id)}
                  className="mb-10  rounded-md bg-sky-400 px-3 py-2 ">
                  Submit
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 pt-10 font-mono ">
              {data.post?.comment.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-1 ">
                  <div className="col-span-1 flex items-center gap-3  ">
                    <span>
                      <Image
                        src={item?.user?.image ?? ''}
                        alt="profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </span>
                  </div>
                  <div className="col-span-10 flex flex-col  rounded-lg border border-gray-600 p-2 text-lg">
                    <div className="flex items-center gap-2  pb-3  ">
                      <span className="text-base font-semibold">{item.user.name}</span>
                      <span className="text-gray-300">
                        {item.commentAt ? format(item.commentAt, 'MMM dd, yy') : null}
                      </span>
                    </div>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
      {/* bottom navigation */}
      <BottomNavigation
        favorite={data.post?.favorite}
        _count={data.post?._count}
        Comment={data.post?.comment}
        likes={data?.post?.like}
        postId={data?.post?.id ?? ''}
        userId={data.post?.userId ?? ''}
        refetchPost={refetch}
      />
    </div>
  );
}

PostInfo.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

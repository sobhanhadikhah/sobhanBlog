import format from 'date-fns/format';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import BottomNavigation from '~/components/bottomNavigation';
import { api } from '~/utils/api';

const PostInfo: NextPage = () => {
  const { query } = useRouter();

  // Ensure that query.id is a string or provide a default value if it's undefined
  const id = typeof query.id === 'string' ? query.id : '';

  const { data, isLoading, isError } = api.post.byId.useQuery({ id });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error loading post</h1>;
  }

  return (
    <div>
      <main className="mx-3">
        <div>
          <div className="flex justify-between">
            <h1 className="text-3xl">{data.post?.title}</h1>
            <span className="text-xs">
              {data.post?.createdAt ? format(data.post?.createdAt, 'MMMM dd, yyyy') : null}
            </span>
          </div>
          <div className="flex gap-3">
            {data.post?.tags.map((item) => (
              <span key={item}>
                {' '}
                <span className="text-blue-500">#</span>
                {item}
              </span>
            ))}
          </div>
        </div>
        <p>{data.post?.content}</p>
      </main>
      {/* bottom navigation */}
      <BottomNavigation id={data?.post?.id ?? ''} />
    </div>
  );
};

export default PostInfo;

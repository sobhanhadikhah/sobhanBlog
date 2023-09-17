import { type NextPage } from 'next';
import Button from '../button';
import format from 'date-fns/format';
import { api } from '~/utils/api';

interface Props {
  title: string;
  id: string;
  content: string;
  createdAt: Date;
  tags?: string[] | undefined;
  refetch: CallableFunction;
}

const Cart: NextPage<Props> = ({ title, id, content, createdAt, tags, refetch }) => {
  // Format the date as "MonthName Day, Year"
  const formattedDate = format(createdAt, 'MMMM dd, yyyy');
  const deletePost = api.post.deleteProduct.useMutation();
  const deletePostHandle = () => {
    try {
      deletePost.mutate({ id });
      if (deletePost.isSuccess) {
        refetch();
      }
    } catch (error) {}
  };
  return (
    <div
      key={id}
      className="col-span-12 mb-auto flex h-full flex-col justify-between gap-3 rounded-lg bg-white p-5 text-black lg:col-span-3 ">
      <div className="flex justify-between">
        <h1 className="text-2xl">{title}</h1>
        <button type="button" onClick={deletePostHandle}>
          Delete
        </button>
      </div>
      <div className="flex flex-wrap gap-3 ">
        {tags?.map((item) => (
          <span className="text-sky-500" key={item} color="blue">
            #{item}
          </span>
        ))}
      </div>
      <span className="text-xs">{formattedDate}</span>
      <p className="text-sm">{content}</p>
      <Button
        type="button"
        className="mb-auto w-full rounded-md bg-red-600 text-white"
        to={`post/${id}`}>
        read more ...
      </Button>
    </div>
  );
};

export default Cart;

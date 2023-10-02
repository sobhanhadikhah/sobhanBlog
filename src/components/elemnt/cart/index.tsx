import { type NextPage } from 'next';
import Button from '../button';
import format from 'date-fns/format';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import { TrashSimple, Spinner } from '@phosphor-icons/react';

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
  const { mutate, isLoading: isLoadingRemove } = api.post.deleteProduct.useMutation({
    onSuccess() {
      refetch();
      toast.success('Ok!', { id: 'postDe' });
    },
    onError() {
      toast.error('Ok!', { id: 'postDe' });
    },
  });
  const deletePostHandle = () => {
    toast.loading('removing', { id: 'postDe' });
    mutate({ id });
  };
  return (
    <div className="col-span-12 lg:col-span-3">
      <div className="mx-auto   rounded-xl bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] p-[1px]">
        <div className="bg-black p-4 ">
          <div
            key={id}
            className="z-50  mb-auto flex h-full flex-col justify-between gap-3 rounded-lg bg-transparent  p-5   ">
            <div className="flex items-center justify-between ">
              <h1 className="text-2xl capitalize ">{title}</h1>
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
        </div>
      </div>
    </div>
  );
};

export default Cart;

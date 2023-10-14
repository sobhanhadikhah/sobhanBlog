/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import Cart from '~/components/elemnt/cart';
import { api } from '~/utils/api';


const ShowingTag: NextPage = ({}) => {
    const {query} = useRouter();
  const id = typeof query.id === 'string' ? query.id : '';

    const {data,refetch} = api.tag.postByTag.useQuery({id})
  return <div className='grid grid-cols-12' >
            {
              //@ts-ignore
                data?.posts.map((item)=><Cart  key={item.id} {...item} refetch={refetch} />)
            }
    </div>;
};

export default ShowingTag;

/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { signIn, useSession } from 'next-auth/react';
import { type ReactNode, useState,  } from 'react';
import { ProtectedLayout } from '~/components/layout/protectedLayouts/protectedLayouts';
//import Button from '~/components/elemnt/button';
//import { api } from '~/utils/api';

/* eslint-disable prettier/prettier */
export default function Dashboard() {
  const [formData, setFormData] = useState({ value: '', label: '' });
  const {status} = useSession();
//  const  {mutate} = api.category.createCategory.useMutation();
  /* const  {mutate:deleteCategory} = api.category.deleteCategory.useMutation({
   onSuccess(){
      refetch();
    }
  });
  const {data,refetch} = api.category.getCategory.useQuery();
   function onHandle() {
    
       mutate({
         label: formData.label, value: formData.value 
      });
      
    
  } */
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }
  
  return (
    <div>
      dashboard
      <h1>
        Create category
      </h1>
      <div className='flex flex-col gap-5  text-black'   >
        <input type="text" onChange={(e) =>
            setFormData({ ...formData, value: e.target.value })
          } value={formData.value}  name="value" placeholder="value" />
        <input onChange={(e) =>
            setFormData({ ...formData, label: e.target.value })
          } type="text" name="label" value={formData.label} placeholder="label" />
       {/*  <Button onClick={onHandle} type='submit' className='text-white bg-red-600'  >
          send
        </Button> */}
      </div>
      <div className='flex flex-col'  >
        <h3 className='text-3xl' >
          category
        </h3>
          {/* {
            data?.categories.map((item)=> <button type='button' onClick={()=> void deleteCategory({id:item.id})}  key={item.id} > {item.label} </button>)
          } */}
      </div>
  </div>
  )
}
Dashboard.getLayout = function getLayout(page: ReactNode) {
  return <ProtectedLayout>{page}</ProtectedLayout>;
};

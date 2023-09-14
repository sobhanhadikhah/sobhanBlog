import { type NextPage } from 'next'
import Button from '../button'

interface Props {
    title:string,
    id:string,
    content:string
}

const Cart: NextPage<Props> = ({title,id,content}) => {
  return <div key={id} className="col-span-12 lg:col-span-3 flex gap-3 bg-white text-black flex-col justify-between rounded-lg p-5 mb-auto h-full " >
  <h1>{title}</h1>
  <p>
    {content}
  </p>
  <Button  type="button" className="bg-red-600 mb-auto rounded-md w-full text-white" to="post/create" >
    read more ...
  </Button>
</div>
}

export default Cart
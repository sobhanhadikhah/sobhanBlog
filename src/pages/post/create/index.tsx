"use client";
import { type FormEvent, useState } from "react";
import { api } from "~/utils/api"

interface post {
  title: string
  content:string
}
const inputStyle = "bg-transparent outline-none focus:outline-none border-b px-3 w-full ";
const buttonStyle = "border px-3 py-1 rounded-xl bg-gray-950 hover:bg-slate-950/5"
function CreatePost() {
    const cProduct = api.post.createPost.useMutation();
    const [value, setValue] = useState<post>({
      title:"",
      content:""
    })
    function handleSubmit(event:FormEvent<HTMLFormElement>){
      event.preventDefault();
    cProduct.mutate({title:value.title,content:value.content})
    }
  return (
      <div className="flex min-h-screen flex-col items-center justify-center" >
        <div className="grid place-content-center " >
    <form onSubmit={handleSubmit}  >
        <div className="flex flex-col gap-5 items-center justify-center " >
      <h1 className="text-3xl" >
        Create Post
      </h1>

        <input
         value={value.title}
         className={inputStyle} 
         onChange={(e)=>setValue((prev)=> ({...prev,title:e.target.value}))}  type="text" name="title" />
        <input className={inputStyle} value={value.content} onChange={(e)=>setValue((prev)=> ({...prev,content:e.target.value}))} type="text" name="content"  />
        <button className={buttonStyle}  type="submit" >Submit</button>
        </div>
    </form>
    </div>
    </div>
  )
}

export default CreatePost
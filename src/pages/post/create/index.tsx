/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';
import { api } from '~/utils/api';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { type MultiValue } from 'react-select';
import toast from 'react-hot-toast';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import { useRouter } from 'next/router';
import Button from '~/components/elemnt/button';
import { signIn, useSession } from 'next-auth/react';
interface Post {
  title: string;
  content: string;
  tags?: Option;
}

interface Option {
  label: string;
  value: string;
  id: string;
}

function CreatePost() {
  const router = useRouter();
  const { status } = useSession();
  const { data: categoryData } = api.category.getCategory.useQuery();
  const { mutate: createPost, isLoading: isLoadingCreatePost } = api.post.createPost.useMutation({
    onSuccess() {
      toast.success('Ok', { id: 'post' });
      router.push('/');
    },
  });

  const {
    data: tagsData,
    refetch: refetchTags,
    isLoading: tagsLoading,
  } = api.tag.getAllTag.useQuery();
  const { mutate: createTag, isLoading: createTagLoading } = api.tag.createTag.useMutation({
    onSuccess() {
      refetchTags();
    },
  });

  const [value, setValue] = useState<Post>({
    title: '',
    content: '',
  });

  const [valueSelect, setValueSelect] = useState<MultiValue<Option> | null>(null);

  const handleCreate = (inputValue: string) => {
    createTag({ label: inputValue, value: inputValue });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Ensure that both title and content are not empty before submitting
    if (value.title.trim() === '' || value.content.trim() === '') {
      // You can handle validation errors here.
      // For example, you can show an error message to the user.
      return;
    }
    if (valueSelect) {
      toast.loading('loading...', { id: 'post' });
      const tagsId = valueSelect?.map((item) => item.id);
      createPost({
        title: value.title,
        content: value.content,
        tags: tagsId,
        image: '',
      });
    }
    setValue({ title: '', content: '' });
  };
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }

  return (
    <div className=" mt-5  w-full !overflow-hidden  ">
      <div className="!overflow-hidden">
        <form onSubmit={handleSubmit} className="mx-3 !overflow-hidden">
          <div className="grid grid-cols-12 items-center justify-center  gap-5 !overflow-hidden ">
            {/* Title */}
            <input
              value={value.title}
              className="item-center col-span-12 w-full 
                bg-transparent px-3 text-3xl font-extrabold outline-none focus:outline-none"
              onChange={(e) => setValue((prev) => ({ ...prev, title: e.target.value }))}
              type="text"
              name="title"
              placeholder="Your Title is here"
            />
            <CreatableSelect
              placeholder="Create or Select Tags"
              isMulti
              className="z-[610] col-span-12 w-full bg-black text-black md:col-span-6  "
              isClearable
              isDisabled={createTagLoading}
              isLoading={createTagLoading || tagsLoading}
              onChange={(newValue) => {
                setValueSelect(newValue);
              }}
              onCreateOption={handleCreate}
              options={tagsData}
              value={valueSelect}
            />
            <Select
              isSearchable
              placeholder="select category  "
              isMulti
              className="z-[600] col-span-12 w-full text-black md:col-span-6  "
              isDisabled={createTagLoading}
              isLoading={createTagLoading || tagsLoading}
              options={categoryData?.categories}
            />

            {/* Content */}
            <MdEditor
              style={{ zIndex: 500, color: 'white', height: 'calc(100vh - 322px)' }}
              theme="dark"
              preview={false}
              showToolbarName
              noPrettier={false}
              autoDetectCode
              showCodeRowNumber
              language="en-US"
              className="col-span-12 w-full"
              modelValue={value.content}
              onChange={(e) => setValue((prev) => ({ ...prev, content: e }))}
            />

            <div>
              <Button
                isLoading={isLoadingCreatePost}
                type="submit"
                className="col-span-6   rounded-md bg-sky-500 ">
                Publish
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

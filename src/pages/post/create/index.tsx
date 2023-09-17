/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import { useState } from 'react';
import { api } from '~/utils/api';
import CreatableSelect from 'react-select/creatable';
import { type MultiValue } from 'react-select';

interface Post {
  title: string;
  content: string;
  tags?: Option;
}

interface Option {
  label: string;
  value: string;
}

const inputStyle =
  'bg-transparent col-span-12 md:col-span-6 item-center outline-none focus:outline-none border-b px-3 w-full';
const textAreaStyle =
  'bg-transparent col-span-12  item-center outline-none focus:outline-none border-b px-3 w-full';
const buttonStyle = 'border col-span-12 px-3 py-1 rounded-xl bg-gray-950 hover:bg-slate-950/5';

function CreatePost() {
  const { mutate: createPost } = api.post.createPost.useMutation();
  const { mutate: createTag, isLoading: createTagLoading } = api.tag.createTag.useMutation();
  const {
    data: tagsData,
    refetch: refetchTags,
    isLoading: tagsLoading,
  } = api.tag.getAllTag.useQuery();

  const [value, setValue] = useState<Post>({
    title: '',
    content: '',
  });

  const [valueSelect, setValueSelect] = useState<MultiValue<Option> | null>(null);

  const handleCreate = async (inputValue: string) => {
    createTag({ label: inputValue, value: inputValue });
    await refetchTags();
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
      const label = valueSelect?.map((item) => item.label);
      createPost({
        title: value.title,
        content: value.content,
        tags: label,
        image: '',
      });
    }
    // After successfully creating the post, you can reset the form or perform any other necessary actions.
    setValue({ title: '', content: '' });
  };

  return (
    <div className="h-screen w-full">
      <div className="">
        <form onSubmit={handleSubmit} className="mx-3">
          <h1 className="py-10 text-3xl ">Create Post</h1>
          <div className="grid grid-cols-12  items-center justify-center gap-5">
            {/* Title */}
            <input
              value={value.title}
              className={inputStyle}
              onChange={(e) => setValue((prev) => ({ ...prev, title: e.target.value }))}
              type="text"
              name="title"
              placeholder="Title"
            />
            <CreatableSelect
              isMulti
              className="col-span-12 w-full text-black md:col-span-6  "
              isClearable
              isDisabled={createTagLoading}
              isLoading={createTagLoading || tagsLoading}
              onChange={(newValue) => setValueSelect(newValue)}
              onCreateOption={handleCreate}
              options={tagsData}
              value={valueSelect}
            />
            {/* Content */}
            <textarea
              className={textAreaStyle}
              value={value.content}
              onChange={(e) => setValue((prev) => ({ ...prev, content: e.target.value }))}
              name="content"
              placeholder="Content"
            />
            <button className={buttonStyle} type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

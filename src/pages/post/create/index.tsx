/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ReactNode, useState, useRef } from 'react';
import { api } from '~/utils/api';
import CreatableSelect from 'react-select/creatable';
//import Select from 'react-select';
import { type MultiValue } from 'react-select';
import toast from 'react-hot-toast';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { ProtectedLayout } from '~/components/layout/protectedLayouts/protectedLayouts';
import Image from 'next/image';
import CreatePostLayout from '~/components/layout/createPost';
import { Spinner } from '@phosphor-icons/react';
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

export default function CreatePost() {
  const router = useRouter();
  const { status } = useSession();

  const [cover, setCover] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadPhoto, isLoading: isUploading } = api.upload.uploadCover.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const base64Data = event.target.result.split(',')[1]; // Extract the base64 data

          uploadPhoto(
            { file: base64Data ?? '', path: 'posts' },
            {
              onSuccess(data) {
                setCover(data.url);
                console.log('cover', cover);
              },
            },
          );
        }
      };
      reader.readAsDataURL(selectedFile);
    }

    // Read the selected file as a base64 encoded string
  };
  // const { data: categoryData } = api.category.getCategory.useQuery();
  const { mutate: createPost } = api.post.createPost.useMutation({
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
  const {
    mutate: createTag,
    isLoading: createTagLoading,
    isSuccess,
  } = api.tag.createTag.useMutation({
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
    // After a successful tag creation, update the valueSelect state
    if (isSuccess) {
    }
    setValueSelect((prevValueSelect) => [
      ...(prevValueSelect || []),
      { label: inputValue, value: inputValue, id: inputValue },
    ]);
  };
  function handleSubmit() {
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
        image: cover,
      });
    }
    setValue({ title: '', content: '' });
  }
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    signIn();
  }
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };

  const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    // Assuming you want to upload multiple files concurrently
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        // Specify the Promise type as string
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            const base64Data = event.target.result.split(',')[1]; // Extract the base64 data

            // Wrap the uploadPhoto function in a Promise
            const uploadPromise = new Promise<void>((onSuccess, onError) => {
              uploadPhoto(
                { file: base64Data ?? '', path: 'posts' },
                {
                  onSuccess(data) {
                    resolve(data.url);
                    onSuccess();
                  },
                  onError(error) {
                    reject(error);
                    onError(error);
                  },
                },
              );
            });

            // You can also handle errors here if needed
            uploadPromise.catch((error) => {
              reject(error);
            });
          }
        };
        reader.readAsDataURL(file);
      });
    });

    // Use Promise.all to wait for all uploads to complete
    Promise.all(uploadPromises)
      .then((urls: string[]) => {
        // Once all uploads are done, call the callback with the array of URLs
        callback(urls);
      })
      .catch((error) => {
        console.error('Error in file uploads:', error);
      });
  };

  return (
    <CreatePostLayout createPost={handleSubmit}>
      <div className=" mx-auto   mt-5  max-w-7xl  ">
        <div className="!overflow-hidden">
          <div>
            <div className="grid grid-cols-12 items-center justify-center  gap-5  ">
              {/* Title */}

              {cover && !isUploading ? (
                <div
                  style={{ width: '100%' }}
                  className="relative col-span-12 aspect-video  w-full  ">
                  <Image
                    blurDataURL="URL"
                    placeholder="blur"
                    src={`${cover}`}
                    alt="cover"
                    fill
                    quality={70}
                  />
                </div>
              ) : null}
              {isUploading ? (
                <div className="col-span-12 flex flex-col items-center justify-center gap-5 text-center text-3xl ">
                  <span className="animate-spin text-purple-100 ">
                    <Spinner size={36} />
                  </span>{' '}
                  Uploading{' '}
                </div>
              ) : null}

              <input
                style={{ display: 'none' }}
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="col-span-12"
              />
              {!isUploading ? (
                <button onClick={handleFileButtonClick} className="col-span-6   ">
                  {cover ? 'Change' : 'Add a cover image'}
                </button>
              ) : null}
              {cover ? (
                <button
                  onClick={() => {
                    setCover(null);
                    // Reset the file input
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="col-span-6">
                  delete
                </button>
              ) : null}

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
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: '0px',
                    borderColor: 'black',
                    outlineColor: 'black',
                    outline: 'none',
                    border: 0,
                    boxShadow: 'none',
                    backgroundColor: 'black',
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: 'white',
                    outline: 'none',
                    outlineColor: 'black',
                  }),
                  indicatorsContainer: (provided) => ({
                    ...provided,
                    display: 'none', // Hide the dropdown indicator
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    backgroundColor: '#171717',
                    color: 'white',
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused
                      ? '#77216F'
                      : state.isSelected
                      ? '#E95420'
                      : 'black', // Background color of focused, selected, and unselected items
                    color: state.isSelected ? 'white' : 'white', // Text color of selected and unselected items
                  }),
                }}
                isOptionDisabled={(tag, AllTags) => (AllTags?.length > 3 ? true : false)}
                placeholder="Add up to 4 tags..."
                isMulti
                className="custom-select z-[610] col-span-12 w-full   text-black outline-none focus:outline-none  "
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

              {/* Content */}
              <div className="col-span-12 flex  h-full w-full ">
                <MdEditor
                  preview={false}
                  onUploadImg={onUploadImg}
                  style={{
                    color: 'white',

                    height: 'calc(100vh - 239px)',
                  }}
                  theme="dark"
                  showToolbarName
                  noPrettier={false}
                  autoDetectCode
                  showCodeRowNumber
                  language="en-US"
                  className="col-span-12  h-full w-full "
                  modelValue={value.content}
                  onChange={(e) => setValue((prev) => ({ ...prev, content: e }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreatePostLayout>
  );
}
CreatePost.getLayout = function getLayout(page: ReactNode) {
  return <ProtectedLayout> {page} </ProtectedLayout>;
};

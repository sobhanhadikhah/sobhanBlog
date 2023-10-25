/* eslint-disable prettier/prettier */
import React, { useState, type ChangeEvent } from 'react';
import { api } from '~/utils/api';

const MyComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { mutate } = api.post.uploadCover.useMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    // Read the selected file as a base64 encoded string
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const base64Data = event.target.result.split(',')[1]; // Extract the base64 data

       
        mutate({file:base64Data ?? "",path:"posts"});
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept=".jpg" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default MyComponent;

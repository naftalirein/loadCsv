import React from 'react';
import styles from './FileInput.module.css';

interface FileInputProps {
  onChange: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChange(event.target.files[0]);
    }
  };

  return (
    <input 
      type="file" 
      onChange={handleFileChange} 
      accept=".csv" 
      className={styles.fileInput}
    />
  );
};

export default FileInput;
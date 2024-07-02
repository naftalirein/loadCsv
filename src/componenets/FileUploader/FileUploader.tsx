import React, { useState } from 'react';
import { put } from '@aws-amplify/api';
import FileInput from './FileInput';
import SubmitButton from './SubmitButton';
import StatusMessage from './StatusMessage';
import { readFileAsText, parseCSV } from './utils';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
  onFileUploaded: (fileKey: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setUploadStatus(null);

    if (!file) {
      setError('Please select a file');
      setLoading(false);
      return;
    }

    if (file.type !== 'text/csv') {
      setError('Please select a CSV file');
      setLoading(false);
      return;
    }

    try {
      const csvContent = await readFileAsText(file);
      const rows = parseCSV(csvContent);
      
      const restOperation = put({
        apiName: 'server',
        path: '/process',
        options: {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: { rows }
        }
      });

      await restOperation.response;
      setUploadStatus('File processed successfully');
      onFileUploaded('done');
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fileUploader}>
      <h2 className={styles.title}>CSV File Uploader</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FileInput onChange={setFile} />
        <SubmitButton loading={loading} />
      </form>
      <StatusMessage error={error} uploadStatus={uploadStatus} />
    </div>
  );
};

export default FileUploader;
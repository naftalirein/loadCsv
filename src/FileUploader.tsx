import React, { useState, ChangeEvent, FormEvent } from 'react';
import { put } from '@aws-amplify/api';

interface FileUploaderProps {
  onFileUploaded: (fileKey: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('CSV file must have a header row and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIndex = headers.indexOf('name');
    const descriptionIndex = headers.indexOf('description');

    if (nameIndex === -1 || descriptionIndex === -1) {
      throw new Error('CSV file must have "Name" and "Description" columns');
    }

    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      if (values.length <= Math.max(nameIndex, descriptionIndex)) {
        throw new Error('Some rows have fewer columns than expected');
      }
      return { 
        name: values[nameIndex], 
        description: values[descriptionIndex]
      };
    }).filter(row => row.name && row.description);

    if (rows.length === 0) {
      throw new Error('No valid data rows found in the CSV file');
    }

    return rows;
  };

  return (
    <div>
      <h2>CSV File Uploader</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Process'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploader;
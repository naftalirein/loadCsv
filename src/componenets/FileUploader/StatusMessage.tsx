import React from 'react';
import styles from './StatusMessage.module.css';

interface StatusMessageProps {
  error: string | null;
  uploadStatus: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ error, uploadStatus }) => (
  <div>
    {error && <p className={styles.error}>{error}</p>}
    {uploadStatus && <p className={styles.success}>{uploadStatus}</p>}
  </div>
);

export default StatusMessage;
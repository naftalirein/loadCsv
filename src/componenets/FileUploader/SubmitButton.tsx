import React from 'react';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => (
  <button type="submit" disabled={loading} className={styles.submitButton}>
    {loading ? 'Processing...' : 'Process'}
  </button>
);

export default SubmitButton;
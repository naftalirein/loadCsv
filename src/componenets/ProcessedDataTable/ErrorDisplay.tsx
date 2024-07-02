import React from 'react';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className={styles.error}>Error: {message}</div>
);

export default ErrorDisplay;
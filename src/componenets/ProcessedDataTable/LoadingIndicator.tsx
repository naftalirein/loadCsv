import React from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator: React.FC = () => (
  <div className={styles.loader}>Loading...</div>
);

export default LoadingIndicator;
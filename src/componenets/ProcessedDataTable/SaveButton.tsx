import React from 'react';
import styles from './SaveButton.module.css';

interface SaveButtonProps {
  onSave: () => void;
  disabled: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, disabled }) => (
  <button onClick={onSave} disabled={disabled} className={styles.button}>
    Save Changes
  </button>
);

export default SaveButton;
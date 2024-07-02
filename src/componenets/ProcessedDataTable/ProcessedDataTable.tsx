import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import SaveButton from './SaveButton';
import LoadingIndicator from './LoadingIndicator';
import ErrorDisplay from './ErrorDisplay';
import { ProcessedRow } from './types';
import { fetchProcessedData, saveData } from './api';
import styles from './ProcessedDataTable.module.css';

interface ProcessedDataTableProps {
    refreshTrigger: number;
    onLoadingChange: (isLoading: boolean) => void;
  }

const ProcessedDataTable: React.FC<ProcessedDataTableProps> = ({ refreshTrigger, onLoadingChange }) => {
    const [data, setData] = useState<ProcessedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    fetchProcessedData(setData, setLoading, setError);
  }, [refreshTrigger]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNlpOutputChange = (index: number, newValue: string) => {
    const updatedData = [...data];
    updatedData[index].nlp_output = newValue;
    setData(updatedData);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      await saveData(data);
      setHasUnsavedChanges(false);
    } catch (error) {
      setError('Failed to save changes. Please try again.');
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className={styles.container}>
      <SaveButton onSave={handleSave} disabled={!hasUnsavedChanges} />
      <DataTable data={data} onNlpOutputChange={handleNlpOutputChange} />
    </div>
  );
};

export default ProcessedDataTable;
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '../amplifyconfiguration.json';
import FileUploader from './FileUploader';
import { useState } from 'react';
import ProcessedDataTable from './componenets/ProcessedDataTable/ProcessedDataTable';
import styles from './App.module.css';

Amplify.configure(config);

export function App({ signOut, user }: WithAuthenticatorProps) {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleFileProcessed = () => {
    console.log('File processed');
    setRefreshCounter(prevCounter => prevCounter + 1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Hello {user?.username}</h1>
        <button onClick={signOut} className={styles.signOutButton}>Sign out</button>
      </header>
      <main className={`${styles.content} ${isLoading ? styles.loadingContent : ''}`}>
        <FileUploader onFileUploaded={handleFileProcessed} />
        <ProcessedDataTable 
          refreshTrigger={refreshCounter} 
          onLoadingChange={setIsLoading}
        />
      </main>
    </div>
  );
}

export default withAuthenticator(App);
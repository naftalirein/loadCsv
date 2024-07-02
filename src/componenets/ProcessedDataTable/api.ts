import { get, put } from '@aws-amplify/api';
import { ProcessedRow } from './types';

export const fetchProcessedData = async (
  setData: React.Dispatch<React.SetStateAction<ProcessedRow[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    setLoading(true);
    const restOperation = get({
      apiName: 'server',
      path: '/file',
      options: {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    });
    const response = await restOperation.response;
    
    if (response.statusCode === 200 && response.body instanceof ReadableStream) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      try {
        const processedData = JSON.parse(result);
        if (Array.isArray(processedData)) {
          setData(processedData);
        }
      } catch (jsonError: any) {
        setError('Error parsing response data: ' + jsonError.message);
      }
    } else {
      setError('Error fetching data: ' + JSON.stringify(response.body));
    }
  } catch (error: any) {
    setError('Error fetching data: ' + error.message);
  } finally {
    setLoading(false);
  }
};

export const saveData = async (data: ProcessedRow[]) => {
  const csvData = data.map(row => 
    `${row.name},${row.description},${row.nlp_output}`
  ).join('\n');

  const headerRow = 'Name,Description,NLP Output\n';
  const fullCsvData = headerRow + csvData;

  const restOperation = put({
    apiName: 'server',
    path: '/file',
    options: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: {
        csvData: fullCsvData
      }
    }
  });
  await restOperation.response;
  console.log('Update sent to server');
};
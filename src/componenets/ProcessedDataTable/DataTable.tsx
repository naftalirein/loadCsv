import React from 'react';
import { ProcessedRow } from './types';
import styles from './DataTable.module.css';

interface DataTableProps {
  data: ProcessedRow[];
  onNlpOutputChange: (index: number, newValue: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onNlpOutputChange }) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>NLP Output</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{row.name}</td>
          <td>{row.description}</td>
          <td>
            <input
              type="text"
              value={row.nlp_output}
              onChange={(e) => onNlpOutputChange(index, e.target.value)}
              className={styles.input}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;
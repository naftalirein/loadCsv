export const readFileAsText = (file: File): Promise<string> => {
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
  
  export const parseCSV = (csvContent: string) => {
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
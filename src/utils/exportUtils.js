// src/utils/exportUtils.js

import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Write the workbook and trigger a download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
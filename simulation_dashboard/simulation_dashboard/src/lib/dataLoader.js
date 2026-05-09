import Papa from "papaparse";

export const loadCSVData = async () => {
  const response = await fetch("/Simulated_Dataset.csv");

  const csvText = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};
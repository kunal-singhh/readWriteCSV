const fs = require('fs');
const fastcsv = require('fast-csv');

const data = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 },
];

// Write the CSV file
const writeCSV = (data, filePath) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    fastcsv
      .write(data, { headers: true })
      .pipe(ws)
      .on('finish', resolve)
      .on('error', reject);
  });
};

const writeCSVRow = (row, index, filePath) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath, { flags: 'a' }); // 'a' for append mode
    fastcsv
      .write([row], { headers: index == 0, includeEndRowDelimiter: true })
      .pipe(ws)
      .on('finish', resolve)
      .on('error', reject);
  });
};

// Read the CSV file
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', reject);
  });
};

// Main function to write and read the CSV file
async function main() {
  const filePath = 'output.csv';

  try {
    // Write the data to CSV
    // await writeCSV(data, filePath);
    // console.log('CSV file written successfully');

    // Write the data to CSV one row at a time
    for (let i = 0; i < data.length; i++) {
      await writeCSVRow(data[i], i, filePath);
    }
    console.log('CSV file written successfully');

    // Read the data from CSV
    const csvData = await readCSV(filePath);
    console.log('CSV file contents:', csvData);

    // Iterate over the rows in the CSV file and log the contents to the console
    csvData.forEach((row) => {
      console.log('CSV row:', row);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

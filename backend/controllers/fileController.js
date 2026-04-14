const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');


exports.upload = (req, res)=>{

    console.log("getting")
    if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      // Delete the temp file after parsing
      fs.unlinkSync(req.file.path);

      // Extract schema from first row
      const columns = Object.keys(results[0] || {});

      // Detect column types
      const schema = columns.map(col => ({
        name: col,
        type: detectType(results, col)
      }));

      res.json({
        rows: results,
        schema,
        totalRows: results.length,
        totalColumns: columns.length
      });
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to parse CSV' });
    });
}

function detectType(rows, column) {
  const sample = rows.slice(0, 10).map(r => r[column]).filter(Boolean);

  const isNumber = sample.every(v => !isNaN(v) && v.trim() !== '');
  if (isNumber) return 'number';

  const isDate = sample.every(v => !isNaN(Date.parse(v)));
  if (isDate) return 'date';

  return 'string';
}
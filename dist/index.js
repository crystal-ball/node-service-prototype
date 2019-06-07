'use strict';

const express = require('express');

const PORT = 8080;
const app = express();

function test() {
  return 'rad';
}

test();
app.get('/', (req, res) => {
  res.send({
    data: {
      message: '🔮 MAGIC'
    }
  });
});
app.listen(PORT, () => {
  console.log(`Service listening on http://localhost:${PORT}`);
}).on('error', err => {
  console.log(err);
  process.exit(1);
});
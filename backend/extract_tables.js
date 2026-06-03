const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(dir);
const tables = new Set();
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match `Table` or Table
  const regex = /(?:FROM|INTO|UPDATE)\s+`?([a-zA-Z]+)`?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    tables.add(match[1]);
  }
}
console.log(Array.from(tables));

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(dir);

const tables = new Set([
  'Admin', 'Booking', 'BookingDriver', 'BookingInsurance', 'Payment', 'Car', 
  'Insurance', 'Branch', 'Category', 'Customer', 'Driver', 'Employee', 
  'FuelPolicy', 'Maintenance', 'PaymentMethod', 'Rental', 'Review',
  'carimage', 'booking', 'payment', 'rental', 'bookingdriver', 'bookinginsurance',
  'maintenance', 'review'
].map(t => t.toLowerCase()));

let totalReplaced = 0;

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Regex to find table names after FROM, INTO, UPDATE, JOIN, IGNORE INTO
  const regex = /(FROM|INTO|UPDATE|JOIN)\s+`?([a-zA-Z]+)`?/g;
  
  newContent = newContent.replace(regex, (match, p1, p2) => {
    if (tables.has(p2.toLowerCase())) {
      // e.g. FROM `Admin` -> FROM `admin`
      // But keep backticks if they were there, wait, the simplest is to just use what was there but lowercased
      // The match is the whole string, e.g. "FROM `Admin`"
      // We can just return the match but with p2 lowercased.
      return match.replace(p2, p2.toLowerCase());
    }
    return match;
  });

  if (content !== newContent) {
    console.log(`Modified ${file}`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    totalReplaced++;
  }
}

// Also check seed-admin.js
const seedFile = path.join(__dirname, 'seed-admin.js');
if (fs.existsSync(seedFile)) {
  let content = fs.readFileSync(seedFile, 'utf8');
  const regex = /(FROM|INTO|UPDATE|JOIN)\s+`?([a-zA-Z]+)`?/g;
  let newContent = content.replace(regex, (match, p1, p2) => {
    if (tables.has(p2.toLowerCase())) {
      return match.replace(p2, p2.toLowerCase());
    }
    return match;
  });
  if (content !== newContent) {
    console.log(`Modified seed-admin.js`);
    fs.writeFileSync(seedFile, newContent, 'utf8');
  }
}

console.log(`Total files modified: ${totalReplaced}`);

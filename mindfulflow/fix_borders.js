const fs = require('fs');
const path = require('path');

const dir = 'src/components/Statistics';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace border border-white/X with just nothing
  content = content.replace(/border border-white\/\d+/g, '');
  
  // Replace border-white/X with nothing
  content = content.replace(/border-white\/\d+/g, '');
  
  // Replace border-none with !border-none
  content = content.replace(/border-none/g, '!border-none');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', file);
  }
});

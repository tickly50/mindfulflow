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

  // Sometimes there is just "border-white/X" without border before it, but we did that above

  // Also catch "border border-indigo-500/30" in StatisticsView if desired? 
  // Let's remove ANY border-white/* completely.
  
  // Add !border-transparent instead of border-none to ensure the .glass border isn't shown
  content = content.replace(/border-none/g, '!border-transparent');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', file);
  }
});

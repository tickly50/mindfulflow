const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]lucide-react['"];?/g;
      
      let changed = false;
      const newContent = content.replace(regex, (match, importsStr) => {
        changed = true;
        
        const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
        const newImports = imports.map(imp => {
          let importName = imp;
          let localName = imp;
          if (imp.includes(' as ')) {
            [importName, localName] = imp.split(' as ').map(s => s.trim());
          }
          
          const fileName = toKebabCase(importName);
          return `import ${localName} from 'lucide-react/dist/esm/icons/${fileName}';`;
        });
        
        return newImports.join('\n');
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done.');

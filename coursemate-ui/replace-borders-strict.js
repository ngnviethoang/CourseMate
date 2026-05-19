const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let filesChanged = 0;

walkDir('b:/project/CourseMate/coursemate-ui/src/app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // We want to find instances of className="..." or className={`...`} and replace \bborder\b inside them.
    // A simple way is to use a replacer function that only acts on className="..." contents.

    const regex = /className=(?:\{`([^`]+)`\}|"([^"]+)")/g;
    
    content = content.replace(regex, (match, backticks, quotes) => {
      let classStr = backticks || quotes || '';
      if (!classStr) return match;

      let originalClassStr = classStr;

      // Replace standalone 'border' class
      // It can be at the start, middle, or end.
      // Easiest is to split by whitespace, filter out 'border', and join.
      // But wait, there are also things like ${...} inside backticks.
      // We only want to remove the exact word 'border'.
      
      classStr = classStr.replace(/\bborder\b/g, '');
      
      // If we removed border, let's ensure it has shadow-md or shadow-sm. If it has shadow-sm, upgrade to shadow-md. 
      // If it has no shadow, add shadow-md.
      // But wait, maybe the user only wants border removed, not necessarily adding shadow if it wasn't a card.
      // The user said "không màu nhưng thể hiện nó như shadow".
      // Let's replace 'shadow-sm' with 'shadow-md'.
      if (originalClassStr !== classStr) {
          classStr = classStr.replace(/\bshadow-sm\b/g, 'shadow-md border-0');
          // cleanup double spaces
          classStr = classStr.replace(/\s+/g, ' ').trim();
          
          if (backticks !== undefined) {
             return `className={\`${classStr}\`}`;
          } else {
             return `className="${classStr}"`;
          }
      }

      return match;
    });

    // Also replace \bborder\b in cases where we couldn't match the whole className (e.g. cn( ... ))
    // `bg-card border p-6` -> `bg-card shadow-md border-0 p-6`
    // Let's just do a generic replacement for the common card pattern that we missed:
    content = content.replace(/bg-card border/g, 'bg-card shadow-md border-0');
    content = content.replace(/border bg-card/g, 'bg-card shadow-md border-0');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesChanged++;
      console.log('Modified:', filePath);
    }
  }
});

console.log('Total files changed:', filesChanged);

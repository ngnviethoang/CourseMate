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
    
    // Convert old custom shadow classes
    content = content.replace(/border-none shadow-xl shadow-foreground\/5/g, 'shadow-md border-0');
    
    // Replace border and shadow-sm with shadow-md and no border
    content = content.replace(/\bborder bg-card p-([0-9]+) shadow-sm/g, 'bg-card p-$1 shadow-md border-0');
    content = content.replace(/\bborder bg-card p-([0-9]+)\b/g, 'bg-card p-$1 shadow-md border-0');
    
    // General border-border replacements
    content = content.replace(/border-border\/50/g, 'border-transparent');
    content = content.replace(/border-border/g, 'border-transparent');
    
    // Header/Footer borders
    content = content.replace(/\bborder-t\b/g, 'shadow-sm border-t-0');
    content = content.replace(/\bborder-b\b/g, 'shadow-sm border-b-0');
    
    // Replace standalone border in card classes
    content = content.replace(/rounded-xl border bg-card/g, 'rounded-xl bg-card shadow-md border-0');
    content = content.replace(/rounded-lg border bg-card/g, 'rounded-lg bg-card shadow-md border-0');
    content = content.replace(/rounded-2xl border bg-card/g, 'rounded-2xl bg-card shadow-md border-0');
    
    content = content.replace(/\bborder bg-card\b/g, 'bg-card shadow-md border-0');
    content = content.replace(/\bborder bg-muted/g, 'bg-muted shadow-sm border-0');

    // Replace generic border border-dashed with something modern, e.g. border-transparent or keep it if dashed?
    // User said "miễn sao k có viền là được" (as long as no border)
    content = content.replace(/border border-dashed/g, 'border-0 border-dashed bg-muted/30 shadow-inner');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesChanged++;
      console.log('Modified:', filePath);
    }
  }
});

console.log('Total files changed:', filesChanged);

const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk('c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend\\src', (filePath) => {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    if (filePath.includes('axiosConfig.js')) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Recalculate proper path to api/axiosConfig
    const srcPath = 'c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend\\src';
    const relativePath = path.relative(path.dirname(filePath), path.join(srcPath, 'api', 'axiosConfig'));
    const correctImportPath = relativePath.replace(/\\/g, '/');
    const finalImport = correctImportPath.startsWith('.') ? correctImportPath : './' + correctImportPath;
    
    // Replace the wrong imports
    let newContent = content.replace(/import API from ['"]\.\.\/\.\.\/api\/axiosConfig['"];/g, `import API from '${finalImport}';`);
    newContent = newContent.replace(/import API from ['"]\.\.\/api\/axiosConfig['"];/g, `import API from '${finalImport}';`);
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log("Fixed import in " + filePath + " to " + finalImport);
    }
});

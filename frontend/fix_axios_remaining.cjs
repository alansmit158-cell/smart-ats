const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/Jobs.jsx',
    'src/pages/Interviews.jsx',
    'src/pages/Dashboard.jsx',
    'src/pages/Candidates.jsx',
    'src/components/ScheduleInterviewModal.jsx'
];

files.forEach(f => {
    const filePath = path.join('c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend', f);
    if (!fs.existsSync(filePath)) {
        console.log("File not found: " + f);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Import replacement
    const depth = filePath.split(path.sep).length - 'c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend\\src\\pages'.split(path.sep).length;
    const importPath = depth === 0 ? '../api/axiosConfig' : '../../api/axiosConfig';

    content = content.replace(/import\s+axios\s+from\s+['"]axios['"];?/g, `import API from '${importPath}';`);
    
    // Replace API calls: axios.method('http://localhost:5000/api...') -> API.method('...')
    content = content.replace(/axios\.(get|post|put|delete|patch)\(\s*[`'"]http:\/\/localhost:5000\/api([^`'"]+)[`'"]/g, "API.$1(`$2`");
    
    // Remove `config` variable definitions
    content = content.replace(/const config = \{\s*headers: \{\s*Authorization: `Bearer \$\{.*?\}`\s*\}[\s,]*\w*:?\s*.*?\s*\};\s*/g, '');
    content = content.replace(/const config = \{\s*headers: \{\s*Authorization: `Bearer \$\{.*?\}`\s*\}\s*\};\s*/g, '');

    // Remove direct manual headers
    content = content.replace(/,\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer\s*\$\{.*?\}`\s*\}\s*\}/g, '');
    
    // Remove `, config` arguments from calls
    content = content.replace(/,\s*config\)/g, ')');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated " + f);
});

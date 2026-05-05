const fs = require('fs');
const path = require('path');

const files = [
    'RecruiterInterviews.jsx',
    'RecruiterSubscription.jsx',
    'RecruiterDashboard.jsx',
    'RecruiterJobs.jsx',
    'RecruiterScoring.jsx',
    'RecruiterMessages.jsx',
    'CandidatePortal.jsx',
    'CandidateApplications.jsx',
    'CandidateUpload.jsx',
    'CandidateProfile.jsx',
    'CandidateChat.jsx',
    'AdminStats.jsx'
];

function findFile(dir, fileName) {
    let result = null;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            result = findFile(fullPath, fileName);
            if (result) break;
        } else if (file === fileName) {
            result = fullPath;
            break;
        }
    }
    return result;
}

files.forEach(f => {
    const filePath = findFile('c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend\\src\\pages', f);
    if (!filePath) {
        console.log("File not found: " + f);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Import replacement
    const depth = filePath.split(path.sep).length - 'c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend\\src\\pages'.split(path.sep).length;
    const importPath = depth === 0 ? '../api/axiosConfig' : '../../api/axiosConfig';

    content = content.replace(/import\s+axios\s+from\s+['"]axios['"];?/g, `import API from '${importPath}';`);
    
    // Replace API calls: axios.method('http://localhost:5000/api...') -> API.method('...')
    // Note: this regex handles single quotes, double quotes and backticks.
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

// CandidateProfile lucide-react specific fix
const cpPath = findFile('c:\\Users\\CYBERIO\\Downloads\\smart-ATS\\frontend\\src\\pages', 'CandidateProfile.jsx');
if (cpPath) {
    let cpContent = fs.readFileSync(cpPath, 'utf-8');
    const lucideMatches = cpContent.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
    if (lucideMatches) {
        let currentImports = lucideMatches[1].split(',').map(s => s.trim());
        const toAdd = ['User', 'Star', 'Award', 'BookOpen', 'TrendingUp', 'TrendingDown', 'Briefcase', 'Mail', 'Phone', 'MapPin', 'Calendar', 'CheckCircle', 'AlertCircle', 'Edit', 'Save', 'X'];
        toAdd.forEach(c => {
            if (!currentImports.includes(c)) currentImports.push(c);
        });
        cpContent = cpContent.replace(lucideMatches[0], `import { \n  ${currentImports.join(', \n  ')}\n} from 'lucide-react'`);
        fs.writeFileSync(cpPath, cpContent, 'utf-8');
        console.log("Fixed lucide imports in CandidateProfile.jsx");
    }
}

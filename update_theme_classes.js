const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/mohdm/DigitalOrbit/src/frontend';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

const replacements = [
    // Backgrounds & Cards
    { regex: /\bbg-slate-[0-9]+\/?[0-9]* dark:bg-dark-card\/?[0-9]*\b/g, replacement: 'bg-muted' },
    { regex: /\bbg-slate-[0-9]+\/?[0-9]* dark:bg-dark-bg\/?[0-9]*\b/g, replacement: 'bg-muted' },
    { regex: /\bbg-white\/[0-9]+ dark:bg-dark-bg\/[0-9]+\b/g, replacement: 'bg-background/50' },
    { regex: /\bbg-slate-900 dark:bg-white\b/g, replacement: 'bg-foreground' },
    { regex: /\bdark:bg-white bg-slate-900\b/g, replacement: 'bg-foreground' },
    
    // Text colors
    { regex: /\btext-slate-500 dark:text-slate-400\b/g, replacement: 'text-muted-foreground' },
    { regex: /\bdark:text-slate-400 text-slate-500\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-slate-400 dark:text-slate-500\b/g, replacement: 'text-muted-foreground' },
    { regex: /\bdark:text-slate-500 text-slate-400\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-slate-300 dark:text-slate-700\b/g, replacement: 'text-muted-foreground' },
    { regex: /\bdark:text-slate-700 text-slate-300\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-white dark:text-slate-900\b/g, replacement: 'text-background' },
    { regex: /\bdark:text-slate-900 text-white\b/g, replacement: 'text-background' },

    // Borders
    { regex: /\bborder-slate-[0-9]+ dark:border-dark-border\b/g, replacement: 'border-border' },
    { regex: /\bdark:border-dark-border border-slate-[0-9]+\b/g, replacement: 'border-border' },
    { regex: /\bborder-slate-[0-9]+ dark:border-slate-[0-9]+\b/g, replacement: 'border-border' },
    { regex: /\bdark:border-slate-[0-9]+ border-slate-[0-9]+\b/g, replacement: 'border-border' },
    { regex: /\bborder-slate-[0-9]+\/50 dark:border-white\/10\b/g, replacement: 'border-border' },

    // Cleanup explicit variables that might be remaining
    { regex: /\bdark:bg-dark-card\b/g, replacement: '' },
    { regex: /\bbg-dark-card\b/g, replacement: 'bg-card' },
    { regex: /\bdark:bg-dark-bg\b/g, replacement: '' },
    { regex: /\bbg-dark-bg\b/g, replacement: 'bg-background' },
    { regex: /\bdark:border-dark-border\b/g, replacement: '' },
    { regex: /\bborder-dark-border\b/g, replacement: 'border-border' },
    { regex: /\bdark:text-dark-text\b/g, replacement: '' },
    { regex: /\btext-dark-text\b/g, replacement: 'text-foreground' },
];

walk(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        for (let rule of replacements) {
            newContent = newContent.replace(rule.regex, rule.replacement);
        }
        // Cleanup double spaces that might be left
        newContent = newContent.replace(/  +/g, ' ');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});

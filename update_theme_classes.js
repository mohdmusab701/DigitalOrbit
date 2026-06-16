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
    // Fix broken opacities
    { regex: /\bbg-muted \/[0-9]+\b/g, replacement: 'bg-muted' },
    { regex: /\bbg-background \/[0-9]+\b/g, replacement: 'bg-background' },
    { regex: /\bbg-card \/[0-9]+\b/g, replacement: 'bg-card' },
    { regex: /\bbg-white\/[0-9]+ \/[0-9]+\b/g, replacement: 'bg-background' },
    { regex: /\bborder-slate-[0-9]+\/[0-9]+ \/[0-9]+\b/g, replacement: 'border-border' },
    { regex: /\/80 backdrop-blur-xl border border-slate-200\/50 \/50 rounded-3xl p-8 shadow-2xl/g, replacement: 'backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl bg-card' },
    { regex: /\bbg-white\/80 \/80/g, replacement: 'bg-card' },
    
    // Replace all remaining bg-white with bg-card (most common use-case for hardcoded bg-white in these templates)
    // Wait, replacing ALL bg-white might break some legitimate white icons or specific elements, 
    // but in a fully theme-aware UI, backgrounds should be bg-background or bg-card.
    { regex: /\bbg-white\b(?!(\/[0-9]+| text-primary))/g, replacement: 'bg-card' },
    
    // Replace remaining hardcoded text colors
    { regex: /\btext-black\b/g, replacement: 'text-foreground' },
    { regex: /\btext-slate-900\b/g, replacement: 'text-foreground' },
    { regex: /\btext-slate-800\b/g, replacement: 'text-foreground' },
    { regex: /\btext-slate-700\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-slate-600\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-slate-500\b/g, replacement: 'text-muted-foreground' },

    // Replace remaining backgrounds
    { regex: /\bbg-slate-50\b/g, replacement: 'bg-muted' },
    { regex: /\bbg-slate-100\b/g, replacement: 'bg-muted' },

    // Replace remaining borders
    { regex: /\bborder-slate-200\b/g, replacement: 'border-border' },
    { regex: /\bborder-slate-300\b/g, replacement: 'border-border' },
    
    // Fix class spaces
    { regex: / +/g, replacement: ' ' }
];

walk(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        for (let rule of replacements) {
            newContent = newContent.replace(rule.regex, rule.replacement);
        }
        
        // Ensure "bg-card text-primary-900" becomes "bg-card text-foreground"
        newContent = newContent.replace(/\bbg-card text-primary-900\b/g, 'bg-card text-foreground');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Cleaned up ${filePath}`);
        }
    }
});

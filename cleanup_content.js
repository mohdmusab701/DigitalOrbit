const fs = require('fs');
const path = require('path');

const targetDirs = [
    'c:/Users/mohdm/DigitalOrbit/src',
    'c:/Users/mohdm/DigitalOrbit/seed-admin.ts'
];

let stats = {
    filesUpdated: 0,
    namesReplaced: 0,
    emailsReplaced: 0,
    phonesReplaced: 0,
    currencyReplaced: 0
};

const namesRegex = /\b(John Doe|Jane Smith|Alex Johnson|Admin User|Test User|Demo User|Sarah Williams|Michael Brown|Emily Chen|David Rodriguez|Marcus Johnson|Elena Rodriguez|James Wilson|Sarah Chen|Emma Thompson|Michael Chen|Sarah Jenkins|David Smith|Amanda Foster|Robert Chen)\b/gi;
const emailRegex = /\b([a-zA-Z0-9._%+-]+@example\.com|(contact|hello|info|support|admin|sales)@digitalorbit\.com|mohdmusab@digitalorbit\.com)\b/gi;
const phoneRegex = /(?:\+1\s*\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}\b|\b555-\d{4}\b)/g;
const usdSymbolRegex = /\$([0-9]+(,[0-9]{3})*(\.[0-9]{2})?)/g;
const usdTextRegex = /\bUSD\b/g;

function formatINR(match, numStr) {
    stats.currencyReplaced++;
    let cleanNum = numStr.replace(/,/g, '');
    let num = Number(cleanNum);
    return '₹' + num.toLocaleString('en-IN');
}

function processFile(filePath) {
    if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach(file => processFile(path.join(filePath, file)));
        return;
    }

    if (!/\.(tsx?|jsx?|md|json)$/.test(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Names
    content = content.replace(namesRegex, () => { stats.namesReplaced++; return 'DigitalOrbit'; });
    
    // Emails
    content = content.replace(emailRegex, () => { stats.emailsReplaced++; return 'mohdmusab701@gmail.com'; });
    
    // Phones
    content = content.replace(phoneRegex, () => { stats.phonesReplaced++; return '+91 9335289386'; });
    
    // Currency
    content = content.replace(usdSymbolRegex, formatINR);
    content = content.replace(usdTextRegex, () => { stats.currencyReplaced++; return 'INR'; });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        stats.filesUpdated++;
        console.log(`Updated ${filePath}`);
    }
}

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) processFile(dir);
});

console.log('\n--- REPORT ---');
console.log(`Files updated: ${stats.filesUpdated}`);
console.log(`Names replaced: ${stats.namesReplaced}`);
console.log(`Emails replaced: ${stats.emailsReplaced}`);
console.log(`Phone numbers replaced: ${stats.phonesReplaced}`);
console.log(`Currency references updated: ${stats.currencyReplaced}`);

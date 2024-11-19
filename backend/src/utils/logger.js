const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const errorLogPath = path.join(logDir, 'error.log');
const logStream = fs.createWriteStream(errorLogPath, { flags: 'a' });

function logError(error, req = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        body: req.body
    };
    
    console.error(JSON.stringify(logEntry, null, 2));
    logStream.write(`${JSON.stringify(logEntry)}\n`);
}

module.exports = { logError }; 
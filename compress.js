const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Input and output file paths
const inputFile = 'data.txt';
const outputFile = 'data.gz';

// Create read stream from data.txt
const readStream = fs.createReadStream(inputFile);

// Create write stream to data.gz
const writeStream = fs.createWriteStream(outputFile);

// Create gzip compression stream
const gzip = zlib.createGzip();

// Handle errors
readStream.on('error', (err) => {
    console.error('Error reading file:', err.message);
    process.exit(1);
});

writeStream.on('error', (err) => {
    console.error('Error writing file:', err.message);
    process.exit(1);
});

gzip.on('error', (err) => {
    console.error('Error during compression:', err.message);
    process.exit(1);
});

// Pipe the streams: read -> compress -> write
readStream
    .pipe(gzip)
    .pipe(writeStream)
    .on('finish', () => {
        const inputStats = fs.statSync(inputFile);
        const outputStats = fs.statSync(outputFile);

        console.log('✅ Compression successful!');
        console.log(`📄 Original size: ${inputStats.size} bytes`);
        console.log(`📦 Compressed size: ${outputStats.size} bytes`);
        console.log(`💾 Compression ratio: ${((1 - outputStats.size / inputStats.size) * 100).toFixed(2)}%`);
    });

console.log('🔄 Compressing data.txt...');

const { execSync } = require('child_process');
const fs = require('fs');

// Path to the .next directory
const nextDir = '.next';

if (!fs.existsSync(nextDir)) {
    console.log('🏗️ .next directory not found, running build...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

console.log('🚀 Starting Next.js application...');
try {
    // Run DB migrations
    console.log('🔄 Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Pass all arguments and environment variables
    // Pass all arguments and environment variables
    // IMPORTANT: On Clever Cloud with output: 'standalone', we must run the standalone server
    // otherwise 'next start' runs dev server or binds to localhost only
    const standalonePath = '.next/standalone/server.js';
    if (fs.existsSync(standalonePath)) {
        console.log('🚀 Running standalone build...');
        // Copy public and static to standalone (sometimes needed depending on CI)
        // actually nextjs does it usually but standalone/server.js is the entry point
        execSync(`node ${standalonePath}`, { stdio: 'inherit' });
    } else {
        console.log('⚠️ Standalone build not found, falling back to next start...');
        execSync('next start', { stdio: 'inherit' });
    }
} catch (error) {
    // Next start will log its own errors
    process.exit(1);
}

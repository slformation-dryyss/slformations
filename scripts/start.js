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
    // Simplified start: build if missing, then run server
    // We remove redundant DB sync here as it's handled in the build script

    // Pass all arguments and environment variables
    // IMPORTANT: On Clever Cloud with output: 'standalone', we must run the standalone server
    const standaloneDir = '.next/standalone';
    const standaloneServer = '.next/standalone/server.js';

    if (fs.existsSync(standaloneServer)) {
        console.log('🚀 Preparing standalone build...');

        // 1. Copy public folder
        if (fs.existsSync('public')) {
            console.log('📂 Copying public folder...');
            try {
                fs.cpSync('public', `${standaloneDir}/public`, { recursive: true, force: true });
            } catch (e) { console.error('Error copying public:', e); }
        }

        // 2. Copy static assets (.next/static)
        if (fs.existsSync('.next/static')) {
            console.log('📂 Copying .next/static folder...');
            try {
                fs.cpSync('.next/static', `${standaloneDir}/.next/static`, { recursive: true, force: true });
            } catch (e) {
                // Create dir if missing (nested)
                fs.mkdirSync(`${standaloneDir}/.next/static`, { recursive: true });
                fs.cpSync('.next/static', `${standaloneDir}/.next/static`, { recursive: true, force: true });
            }
        }

        console.log('🚀 Running standalone server...');
        execSync(`node ${standaloneServer}`, { stdio: 'inherit' });
    } else {
        console.log('⚠️ Standalone build not found, falling back to next start...');
        execSync('next start', { stdio: 'inherit' });
    }
} catch (error) {
    // Next start will log its own errors
    process.exit(1);
}

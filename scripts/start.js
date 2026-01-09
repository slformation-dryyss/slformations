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
    execSync('next start', { stdio: 'inherit' });
} catch (error) {
    // Next start will log its own errors
    process.exit(1);
}

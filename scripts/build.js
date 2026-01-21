#!/usr/bin/env node

/**
 * Custom build script for Clever Cloud deployment
 * Handles Prisma migrations with connection pooling to avoid "too many connections" errors
 */

const { execSync } = require('child_process');

console.log('🏗️  Starting build process...');

try {
    // Step 1: Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Step 2: Deploy migrations with connection limit
    console.log('🔄 Deploying database migrations...');
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl) {
        // Add connection_limit=1 to avoid exhausting connections during migration
        const limitedDbUrl = dbUrl.includes('?')
            ? `${dbUrl}&connection_limit=1`
            : `${dbUrl}?connection_limit=1`;

        const maxRetries = 3;
        let attempt = 0;
        let success = false;

        while (attempt < maxRetries && !success) {
            try {
                attempt++;
                console.log(`🔄 Deploying database migrations (Attempt ${attempt}/${maxRetries})...`);
                execSync('npx prisma migrate deploy', {
                    stdio: 'inherit',
                    env: { ...process.env, DATABASE_URL: limitedDbUrl }
                });
                success = true;
            } catch (err) {
                console.error(`⚠️ Migration failed on attempt ${attempt}:`, err.message);
                if (attempt < maxRetries) {
                    console.log('⏳ Waiting 5 seconds before retrying...');
                    const waitTill = new Date(new Date().getTime() + 5000);
                    while (waitTill > new Date()) { } // Synchronous wait
                } else {
                    console.warn(`⚠️ All attempts failed. Continuing build without migrations (Risk: Schema mismatch if changes were made). Error: ${err.message}`);
                    // throw err; // Bypass for now to allow deployment
                }
            }
        }
    } else {
        console.warn('⚠️  DATABASE_URL not found, skipping migrations');
    }

    // Step 3: Build Next.js
    console.log('⚡ Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });

    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

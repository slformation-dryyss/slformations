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

        execSync('npx prisma migrate deploy', {
            stdio: 'inherit',
            env: { ...process.env, DATABASE_URL: limitedDbUrl }
        });
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

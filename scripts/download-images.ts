
import fs from 'fs';
import path from 'path';
import https from 'https';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const images = [
    { url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop', filename: 'permis-b-manuelle.jpg' },
    { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop', filename: 'permis-b-auto.jpg' },
    { url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1000&auto=format&fit=crop', filename: 'permis-b-aac.jpg' },
    { url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop', filename: 'permis-a1.jpg' },
    { url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop', filename: 'permis-a2.jpg' },
    { url: 'https://images.unsplash.com/photo-1519339113688-640c98585698?q=80&w=1000&auto=format&fit=crop', filename: 'permis-c.jpg' },
    { url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1000&auto=format&fit=crop', filename: 'permis-ce.jpg' },
    { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop', filename: 'permis-d.jpg' },
    { url: 'https://images.unsplash.com/photo-1626127117180-2a5cb82bc5fc?q=80&w=1000&auto=format&fit=crop', filename: 'permis-be.jpg' },
];

async function downloadImage(url: string, filepath: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            streamPipeline(response, file)
                .then(() => resolve(true))
                .catch(reject);
        }).on('error', reject);
    });
}

async function main() {
    const targetDir = path.join(process.cwd(), 'public', 'images', 'courses');
    
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log('Starting image downloads...');

    for (const img of images) {
        const filepath = path.join(targetDir, img.filename);
        try {
            await downloadImage(img.url, filepath);
            console.log(`Downloaded: ${img.filename}`);
        } catch (error) {
            console.error(`Error downloading ${img.filename}:`, error);
        }
    }

    console.log('All downloads complete.');
}

main();

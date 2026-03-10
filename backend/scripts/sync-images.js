#!/usr/bin/env node
/*
  sync-images.js

  - Collects image URLs from frontend data files (`src/data/menuData.ts`, `src/data/imageUrls.ts`)
  - Downloads each image to `backend/uploads/images/`
  - Stores the image in MongoDB using a simple `Image` model (filename, contentType, data)
  - Writes a mapping file `backend/uploads/image-mapping.json` with originalUrl -> imageId
  - Optionally updates frontend files to replace URLs with `${BACKEND_URL}/api/images/:id` when run with `--apply` and `--backendUrl`

  Usage:
    node scripts/sync-images.js [--apply] [--backendUrl=http://localhost:5000]

*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads', 'images');
const MAPPING_FILE = path.resolve(__dirname, '..', 'uploads', 'image-mapping.json');

const FRONTEND_MENU = path.resolve(__dirname, '..', '..', 'src', 'data', 'menuData.ts');
const FRONTEND_IMAGES = path.resolve(__dirname, '..', '..', 'src', 'data', 'imageUrls.ts');

const argv = require('minimist')(process.argv.slice(2));
const APPLY = !!argv.apply;
const BACKEND_URL = argv.backendUrl || process.env.BACKEND_URL || '';

async function ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true });
}

function extractUrlsFromText(text) {
    const urlRegex = /https?:\/\/[^\"'\s)]+/g;
    const matches = text.match(urlRegex) || [];
    // filter common image hosts and remove query fragments that break filenames
    return matches.filter(u => /images\.unsplash\.com|lh3\.googleusercontent\.com|i\.ibb\.co|placehold\.co|googleusercontent\.com/.test(u));
}

async function downloadBuffer(url) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        const buffer = Buffer.from(res.data);
        const contentType = res.headers['content-type'] || 'application/octet-stream';
        return { buffer, contentType };
    } catch (err) {
        console.error('Failed to download', url, err.message);
        return null;
    }
}

async function main() {
    console.log('🔎 Collecting image URLs from frontend files...');
    const files = [FRONTEND_MENU, FRONTEND_IMAGES];
    const urls = new Set();

    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const text = await fs.promises.readFile(file, 'utf8');
        extractUrlsFromText(text).forEach(u => urls.add(u));
    }

    const urlList = Array.from(urls);
    console.log(`Found ${urlList.length} candidate image URLs`);

    await ensureDir(UPLOADS_DIR);

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant01';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    const ImageSchema = new mongoose.Schema({
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
        data: { type: Buffer, required: true },
        createdAt: { type: Date, default: Date.now }
    });
    const Image = mongoose.model('ImageForSync', ImageSchema, 'images');

    const mapping = fs.existsSync(MAPPING_FILE) ? JSON.parse(await fs.promises.readFile(MAPPING_FILE, 'utf8')) : {};

    for (const url of urlList) {
        if (mapping[url]) {
            console.log('↩️  Already mapped:', url, '->', mapping[url]);
            continue;
        }

        console.log('⬇️  Downloading', url);
        const result = await downloadBuffer(url);
        if (!result) continue;

        const { buffer, contentType } = result;

        // derive extension
        const extMatch = url.split('?')[0].match(/\.([a-zA-Z0-9]{2,5})$/);
        const ext = extMatch ? extMatch[1] : (contentType.split('/')[1] || 'bin');
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const localPath = path.join(UPLOADS_DIR, safeName);

        await fs.promises.writeFile(localPath, buffer);
        console.log('💾 Saved local copy:', path.relative(process.cwd(), localPath));

        try {
            const doc = await Image.create({ filename: safeName, contentType, data: buffer });
            mapping[url] = doc._id.toString();
            console.log('🗄️  Stored in MongoDB with id', mapping[url]);
        } catch (err) {
            console.error('❌ Failed to store in MongoDB for', url, err.message);
        }
    }

    await fs.promises.writeFile(MAPPING_FILE, JSON.stringify(mapping, null, 2));
    console.log('🗺️  Mapping saved to', path.relative(process.cwd(), MAPPING_FILE));

    if (APPLY) {
        if (!BACKEND_URL) {
            console.warn('--apply requested but no --backendUrl provided and BACKEND_URL env not set. Skipping file updates.');
        } else {
            console.log('♻️  Updating frontend files to point to backend image endpoints...');
            // update menuData.ts and imageUrls.ts
            for (const file of files) {
                if (!fs.existsSync(file)) continue;
                let text = await fs.promises.readFile(file, 'utf8');
                for (const [orig, id] of Object.entries(mapping)) {
                    const target = `${BACKEND_URL.replace(/\/$/, '')}/api/images/${id}`;
                    // replace all occurrences of the exact orig string (may be wrapped in quotes)
                    const escaped = orig.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
                    const re = new RegExp(escaped, 'g');
                    text = text.replace(re, target);
                }
                await fs.promises.writeFile(file, text, 'utf8');
                console.log('🔁 Updated', path.relative(process.cwd(), file));
            }
        }
    }

    console.log('✅ Done.');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'public', 'images', 'routes');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const images = {
    'chirala-hyderabad.jpg': 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400',
    'chirala-vijayawada.jpg': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400',
    'chirala-bangalore.jpg': 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80&w=400',
    'chirala-chennai.jpg': 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&q=80&w=400',
    'chirala-visakhapatnam.jpg': 'https://images.unsplash.com/photo-1599661046289-e31897846140?auto=format&fit=crop&q=80&w=400',
    'chirala-tirupati.jpg': 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400',
    'chirala-nellore.jpg': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400',
    'chirala-ongole.jpg': 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80&w=400',
    'hyderabad-vijayawada.jpg': 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&q=80&w=400',
    'hyderabad-bangalore.jpg': 'https://images.unsplash.com/photo-1599661046289-e31897846140?auto=format&fit=crop&q=80&w=400',
    'hyderabad-chennai.jpg': 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400',
    'hyderabad-visakhapatnam.jpg': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400',
    'vijayawada-chennai.jpg': 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80&w=400',
    'bangalore-chennai.jpg': 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&q=80&w=400',
    'bangalore-tirupati.jpg': 'https://images.unsplash.com/photo-1599661046289-e31897846140?auto=format&fit=crop&q=80&w=400',
    'chennai-tirupati.jpg': 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400',
    'default-route.jpg': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400'
};

function downloadImage(filename, url) {
    return new Promise((resolve, reject) => {
        const dest = path.join(dir, filename);
        if (fs.existsSync(dest)) {
            console.log(`Exists: ${filename}`);
            return resolve();
        }
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if(response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    for (const [name, url] of Object.entries(images)) {
        try {
            await downloadImage(name, url);
            console.log(`Downloaded: ${name}`);
        } catch (e) {
            console.error(e.message);
        }
    }
    console.log("Done");
}
run();

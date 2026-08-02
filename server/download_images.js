const google = require('googlethis');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const dishes = [
  { id: 'menu_idly', query: 'idli sambar chutney premium photography' },
  { id: 'menu_dosai', query: 'masala dosa south indian premium food photography' },
  { id: 'menu_pongal', query: 'ven pongal south indian premium photography' },
  { id: 'menu_poori', query: 'poori masala premium food photography' },
  { id: 'menu_chapathi', query: 'chapathi kurma premium food photography' },
  { id: 'menu_kichadi', query: 'rava kichadi upma premium food photography' },
  { id: 'menu_aappam', query: 'aappam appam with coconut milk premium photography' },
  { id: 'menu_kuzhi', query: 'kuzhi paniyaram paddu premium food photography' },
  { id: 'menu_meals', query: 'south indian veg thali meals banana leaf premium photography' },
  { id: 'menu_nonveg_meals', query: 'south indian non veg thali chicken fish premium photography' },
  { id: 'menu_malli', query: 'coriander rice malli rice premium photography' },
  { id: 'menu_kovakai', query: 'kovakai tindora rice premium photography' },
  { id: 'menu_coconut', query: 'coconut rice south indian premium photography' },
  { id: 'menu_tomato', query: 'tomato rice south indian premium food photography' },
  { id: 'menu_lemon', query: 'lemon rice chitranna premium food photography' },
  { id: 'menu_curd', query: 'curd rice thayir sadam pomegranate premium photography' },
  { id: 'menu_pudina', query: 'mint rice pudina rice premium photography' },
  { id: 'menu_puliyotharai', query: 'puliyogare tamarind rice premium photography' },
  { id: 'menu_vegbiryani', query: 'veg biryani premium food photography' }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
      }
    }).on('error', reject);
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function run() {
  const dir = path.join(__dirname, '../client/public/menu');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const dish of dishes) {
    console.log(`Searching for: ${dish.query}`);
    try {
      const images = await google.image(dish.query, { safe: false });
      if (images && images.length > 0) {
        // Find a high resolution image that is not from stock photo watermarks if possible
        let selectedImg = images[0].url;
        for (const img of images) {
            if (img.width > 600 && !img.url.includes('shutterstock') && !img.url.includes('istock')) {
                selectedImg = img.url;
                break;
            }
        }
        
        console.log(`Found image for ${dish.id}: ${selectedImg}`);
        const dest = path.join(dir, `${dish.id}.jpg`);
        await downloadImage(selectedImg, dest).catch(() => console.log('Download failed'));
      }
    } catch (err) {
      console.error(`Failed to fetch for ${dish.id}:`, err.message);
    }
  }
}

run();

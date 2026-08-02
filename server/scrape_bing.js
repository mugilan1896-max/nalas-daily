const fs = require('fs');
const https = require('https');
const path = require('path');

const dishes = [
  { id: 'menu_idly', query: 'idli sambar breakfast food photography' },
  { id: 'menu_dosai', query: 'masala dosa plate photography' },
  { id: 'menu_pongal', query: 'ven pongal dish photography' },
  { id: 'menu_poori', query: 'poori masala food photography' },
  { id: 'menu_chapathi', query: 'chapathi plate photography' },
  { id: 'menu_kichadi', query: 'rava kichadi upma food photography' },
  { id: 'menu_aappam', query: 'appam with coconut milk photography' },
  { id: 'menu_kuzhi', query: 'kuzhi paniyaram photography' },
  { id: 'menu_meals', query: 'south indian veg thali meals banana leaf' },
  { id: 'menu_nonveg_meals', query: 'south indian non veg thali chicken' },
  { id: 'menu_malli', query: 'coriander rice malli sadam' },
  { id: 'menu_kovakai', query: 'tindora rice kovakai sadam' },
  { id: 'menu_coconut', query: 'coconut rice food photography' },
  { id: 'menu_tomato', query: 'tomato rice dish photography' },
  { id: 'menu_lemon', query: 'lemon rice dish photography' },
  { id: 'menu_curd', query: 'curd rice pomegranate photography' },
  { id: 'menu_pudina', query: 'mint rice pudina rice photography' },
  { id: 'menu_puliyotharai', query: 'tamarind rice puliyogare photography' },
  { id: 'menu_vegbiryani', query: 'veg biryani photography' }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (res) => {
           if (res.statusCode === 200) {
             const file = fs.createWriteStream(dest);
             res.pipe(file);
             file.on('finish', () => file.close(resolve));
           } else {
             reject(new Error(`Redirect Status: ${res.statusCode}`));
           }
        }).on('error', reject);
      } else {
        reject(new Error(`Status: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const dir = path.join(__dirname, '../client/public/menu');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const dish of dishes) {
    if (fs.existsSync(path.join(dir, `${dish.id}.jpg`))) {
        console.log(`Skipping ${dish.id}, already exists`);
        continue;
    }
    console.log(`Searching for: ${dish.query}`);
    try {
      const html = await fetchHTML(`https://www.bing.com/images/search?q=${encodeURIComponent(dish.query)}&FORM=HDRSC3`);
      
      // Extract the first thumbnail image (Bing uses murl for full images, or turl for thumbnails)
      const murlMatch = html.match(/murl&quot;:&quot;(.*?)&quot;/);
      const turlMatch = html.match(/turl&quot;:&quot;(.*?)&quot;/);
      
      let imageUrl = null;
      if (turlMatch && turlMatch[1]) {
        imageUrl = turlMatch[1]; // Thumbnail is safer and faster
      } else if (murlMatch && murlMatch[1]) {
        imageUrl = murlMatch[1];
      }
      
      if (imageUrl) {
        console.log(`Found image for ${dish.id}: ${imageUrl}`);
        const dest = path.join(dir, `${dish.id}.jpg`);
        await downloadImage(imageUrl, dest);
      } else {
        console.log(`No image URL found for ${dish.id}`);
      }
    } catch (err) {
      console.error(`Failed to fetch for ${dish.id}:`, err.message);
    }
    // Small delay to prevent blocking
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();

const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const dishes = [
  { id: 'menu_idly', query: 'idli sambar premium photography' },
  { id: 'menu_dosai', query: 'masala dosa plate photography' },
  { id: 'menu_pongal', query: 'ven pongal dish photography' },
  { id: 'menu_poori', query: 'poori masala food photography' },
  { id: 'menu_chapathi', query: 'chapathi kurma plate photography' },
  { id: 'menu_kichadi', query: 'rava kichadi food photography' },
  { id: 'menu_aappam', query: 'aappam coconut milk photography' },
  { id: 'menu_kuzhi', query: 'kuzhi paniyaram photography' },
  { id: 'menu_meals', query: 'south indian veg thali meals banana leaf' },
  { id: 'menu_nonveg_meals', query: 'south indian non veg thali' },
  { id: 'menu_malli', query: 'coriander rice malli sadam' },
  { id: 'menu_kovakai', query: 'tindora rice kovakai sadam' },
  { id: 'menu_coconut', query: 'coconut rice food photography' },
  { id: 'menu_tomato', query: 'tomato rice dish photography' },
  { id: 'menu_lemon', query: 'lemon rice dish photography' },
  { id: 'menu_curd', query: 'curd rice pomegranate photography' },
  { id: 'menu_pudina', query: 'mint rice pudina rice photography' },
  { id: 'menu_puliyotharai', query: 'tamarind rice puliyogare photography' },
  { id: 'menu_vegbiryani', query: 'veg biryani premium photography' }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        reject(new Error(`Status: ${response.statusCode}`));
      }
    }).on('error', reject);
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: "C:\\Users\\Mugilan\\.cache\\puppeteer\\chrome\\win64-151.0.7922.47\\chrome-win64\\chrome.exe"
  });
  const page = await browser.newPage();
  const dir = path.join(__dirname, '../client/public/menu');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const dish of dishes) {
    if (fs.existsSync(path.join(dir, `${dish.id}.jpg`))) {
        console.log(`Skipping ${dish.id}, already exists`);
        continue;
    }
    console.log(`Searching for: ${dish.query}`);
    try {
      await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(dish.query)}`, { waitUntil: 'domcontentloaded' });
      
      // Wait for image results to load
      await page.waitForSelector('.mimg', { timeout: 5000 });
      
      // Extract the first image src
      const imageUrl = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('.mimg'));
        for (let img of imgs) {
            // Bing stores the high-res link in a different attribute sometimes, or src is a data URI. 
            // Often src is a bing thumbnail URL (OIP)
            if (img.src && img.src.startsWith('http')) {
                return img.src;
            }
        }
        return null;
      });

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
  }

  await browser.close();
}

run();

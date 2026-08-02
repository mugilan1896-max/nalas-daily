const fs = require('fs');
const https = require('https');

const prompts = [
  {
    filename: '../client/public/menu/menu_meals.png',
    prompt: 'A premium South Indian Vegetarian Meals (Thali) photographed from above. A fresh green banana leaf filled with white rice, sambar, rasam, kootu, poriyal, pickle, and a crispy papad (appalam). Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_nonveg_meals.png',
    prompt: 'A premium South Indian Non-Vegetarian Meals (Thali) photographed from above. A fresh green banana leaf filled with white rice, rich red chicken curry, a piece of fish fry, and half a boiled egg. Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_malli.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of fragrant Malli Rice (Coriander rice, slightly green-tinted seasoned rice) garnished with roasted cashews, served with a side of raita. Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_kovakai.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of Kovakai Rice (Ivy gourd seasoned rice, mixed with stir-fried sliced tindora/kovakai and spices). Professional food photography, studio lighting, ultra realistic, warm appetizing tones.'
  }
];

function downloadImage(p) {
  return new Promise((resolve) => {
    const encodedPrompt = encodeURIComponent(p.prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;
    
    https.get(url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 302) {
        const redirectUrl = res.headers.location || url;
        https.get(redirectUrl, (imageRes) => {
          if (imageRes.statusCode !== 200) {
            console.error(`Failed to download ${p.filename}: ${imageRes.statusCode}`);
            resolve();
            return;
          }
          const fileStream = fs.createWriteStream(p.filename);
          imageRes.pipe(fileStream);
          fileStream.on('finish', () => {
            console.log(`Successfully downloaded ${p.filename}`);
            resolve();
          });
        });
      } else {
        console.error(`Failed to get image for ${p.filename}. Status: ${res.statusCode}`);
        resolve();
      }
    });
  });
}

async function run() {
  for (const p of prompts) {
    await downloadImage(p);
    console.log('Waiting 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
  }
  console.log('Done');
}

run();

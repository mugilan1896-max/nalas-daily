const fs = require('fs');
const https = require('https');

const prompts = [
  {
    filename: '../client/public/menu/menu_pudina.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of Pudina Rice (Mint rice, light green colored rice mixed with fresh mint leaves and spices), garnished with cashews. Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_puliyotharai.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of Puliyotharai (Tamarind rice, dark tangy rice mixed with roasted peanuts, red chilies, and curry leaves). Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_vegbiryani.png',
    prompt: 'A premium South Indian meal platter photographed from above. A large bowl of Veg Biryani (Aromatic basmati rice cooked with mixed vegetables, rich spices, and saffron), served with raita and salna. Professional food photography, studio lighting, ultra realistic.'
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

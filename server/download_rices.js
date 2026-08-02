const fs = require('fs');
const https = require('https');

const prompts = [
  {
    filename: '../client/public/menu/menu_coconut.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of white Coconut Rice (rice mixed with freshly grated coconut, garnished with roasted cashews and curry leaves). Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_tomato.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of red Tomato Rice (tangy and spicy rice cooked with tomatoes and herbs). Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_lemon.png',
    prompt: 'A premium South Indian meal platter photographed from above. A plate of bright yellow Lemon Rice (zesty lemon-flavored rice tempered with peanuts, turmeric, and mustard seeds). Professional food photography, studio lighting, ultra realistic.'
  },
  {
    filename: '../client/public/menu/menu_curd.png',
    prompt: 'A premium South Indian meal platter photographed from above. A bowl of creamy white Curd Rice (yogurt rice tempered with mustard seeds, curry leaves, and garnished with red pomegranate seeds). Professional food photography, studio lighting, ultra realistic.'
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

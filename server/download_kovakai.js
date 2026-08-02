const fs = require('fs');
const https = require('https');

const p = {
  filename: '../client/public/menu/menu_kovakai.png',
  prompt: 'A premium South Indian meal platter photographed from above. A plate of Kovakai Rice (Ivy gourd seasoned rice, mixed with stir-fried sliced tindora/kovakai and spices). Professional food photography, studio lighting, ultra realistic, warm appetizing tones.'
};

const encodedPrompt = encodeURIComponent(p.prompt);
const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;

https.get(url, (res) => {
  const redirectUrl = res.headers.location || url;
  https.get(redirectUrl, (imageRes) => {
    const fileStream = fs.createWriteStream(p.filename);
    imageRes.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`Successfully downloaded ${p.filename}`);
    });
  });
});

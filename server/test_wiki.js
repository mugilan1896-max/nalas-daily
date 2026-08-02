const https = require('https');

function searchWiki(query) {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=original&format=json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0];
            resolve(page.original?.source || null);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
  });
}

async function test() {
  console.log('Poori:', await searchWiki('Puri (food)'));
  console.log('Tomato Rice:', await searchWiki('Tomato rice'));
  console.log('Coconut Rice:', await searchWiki('Coconut rice'));
  console.log('Lemon Rice:', await searchWiki('Lemon rice'));
  console.log('Curd Rice:', await searchWiki('Curd rice'));
  console.log('Pongal:', await searchWiki('Pongal (dish)'));
  console.log('Kuzhi Paniyaram:', await searchWiki('Paddu')); // Paniyaram
  console.log('Malli Rice:', await searchWiki('Coriander rice'));
}
test();

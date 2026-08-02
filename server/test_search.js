const { image_search } = require('duckduckgo-images-api');

async function test() {
  try {
    const results = await image_search({ query: 'Tomato Rice south indian food premium', moderate: true });
    console.log('Tomato Rice:', results.slice(0, 3).map(r => r.image));
  } catch (err) {
    console.error(err);
  }
}
test();

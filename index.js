(async() => {
  await import('./index.mjs');
})();
var cron = require('node-cron');

cron.schedule('*/1 * * * *', () => {
  console.log('ping');
});

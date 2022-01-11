const osLocale = require('os-locale');

async function exec() {
  const lang = await osLocale();
}

exec();

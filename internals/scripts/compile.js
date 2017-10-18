const prodBundles = require('../webpack/webpack.prod.babel')

module.exports = async () => {
  console.log('Compiling modern and legacy script bundles...\n')
  await prodBundles()
};

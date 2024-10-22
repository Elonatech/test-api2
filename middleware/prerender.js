const prerender = require('prerender-node');

const prerenderConfig = {
  prerenderServiceUrl: 'https://service.prerender.io',
  prerenderToken: process.env.PRERENDER_TOKEN,
  protocol: 'https',
  host: 'elonatech.com.ng',
  
  shouldPrerender: function(req) {
    // Check if request is from bot/crawler
    const userAgent = req.headers['user-agent'];
    const bufferAgent = req.headers['x-bufferbot'];
    const isBot = userAgent && (
      userAgent.toLowerCase().indexOf('bot') > -1 ||
      userAgent.toLowerCase().indexOf('crawler') > -1 ||
      userAgent.toLowerCase().indexOf('spyder') > -1 ||
      userAgent.toLowerCase().indexOf('whatsapp') > -1 ||
      userAgent.toLowerCase().indexOf('facebook') > -1 ||
      userAgent.toLowerCase().indexOf('twitter') > -1
    );

    // Only prerender product pages and homepage for bots
    return (isBot || bufferAgent) && (
      req.url.startsWith('/product/') ||
      req.url === '/'
    );
  }
};

module.exports = prerender.set('prerenderServiceUrl', prerenderConfig.prerenderServiceUrl)
                         .set('prerenderToken', prerenderConfig.prerenderToken)
                         .set('protocol', prerenderConfig.protocol)
                         .set('host', prerenderConfig.host)
                         .set('shouldPrerender', prerenderConfig.shouldPrerender);
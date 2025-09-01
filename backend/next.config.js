/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        // /file2/uploads/...  →  /uploads/...
        { source: '/file2/:path*', destination: '/:path*' },
      ];
    },
  };
  
  module.exports = nextConfig;
  // next.config.js
module.exports = {
  async rewrites() {
    return [
      { source: '/history', destination: '/history.html' },
      { source: '/log', destination: '/activity-feed.html' },
      { source: '/post', destination: '/post.html' },
      { source: '/gm', destination: '/gm.html' },
      { source: '/', destination: '/index.html' },
      { source: '/officer', destination: '/officer.html' },
      { source: '/post', destination: '/post.html' },
      { source: '/event', destination: '/event.html' },
      { source: '/faq', destination: '/faq.html' },
      { source: '/join', destination: '/join.html' },
      { source: '/register', destination: '/register.html' },

    ]
  }
}

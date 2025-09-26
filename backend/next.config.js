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
  module.exports = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'api.ucdksea.com', pathname: '/uploads/**' },
      ],
      // 또는 간단히
      // domains: ['api.ucdksea.com'],
    },
  };
  
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
      { source: '/uploads/:path*', destination: 'https://api.ucdksea.com/uploads/:path*' }

    ]
  }
}

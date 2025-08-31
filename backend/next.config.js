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
      { source: '/log', destination: '/log.html' },
      { source: '/post', destination: '/post.html' },
    ]
  }
}

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
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ucdksea-prod-uploads.s3.us-west-2.amazonaws.com', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'cdn.ucdksea.com', pathname: '/uploads/**' }, // Phase 2
    ],
    // domains: ['ucdksea-prod-uploads.s3.us-west-2.amazonaws.com', 'cdn.ucdksea.com'], // 대안
  },
  async rewrites() {
    return [
      // 혹시 과거 상대경로가 남아 있으면 보호
      { source: '/uploads/:path*', destination: 'https://cdn.ucdksea.com/uploads/:path*' }, // Phase 2
      // Phase 1이라면 S3 도메인으로:
      // { source: '/uploads/:path*', destination: 'https://ucdksea-prod-uploads.s3.us-west-2.amazonaws.com/uploads/:path*' },
    ];
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

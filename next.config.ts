import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['academiamontecastelo.com.br', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Otimizações de SEO
  compress: true,
  poweredByHeader: false, // Remove o header X-Powered-By
  // Generate static pages para melhor performance
  generateBuildId: async () => {
    // Use o hash do commit ou timestamp
    return process.env.BUILD_ID || 'build-' + Date.now();
  },
};

export default nextConfig;

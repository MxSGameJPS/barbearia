/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desabilitar verificação de ESLint durante build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desabilitar verificação de tipos durante build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

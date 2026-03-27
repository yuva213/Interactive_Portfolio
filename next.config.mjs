/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbopack: {
      // Set to '.' to ensure it uses the local folder as root and avoids picking up 
      // global lockfiles from the user's home folder.
      root: '.'
    }
  }
};

export default nextConfig;

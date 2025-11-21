
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    __firebase_config: process.env.__firebase_config,
    __app_id: process.env.__app_id,
    __initial_auth_token: process.env.__initial_auth_token || ""
  }
};

module.exports = nextConfig;
    
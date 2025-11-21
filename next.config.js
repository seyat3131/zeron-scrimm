// next.config.js
module.exports = {
  env: {
    __firebase_config: process.env.FIREBASE_CONFIG || 'default_firebase_config',
    __app_id: process.env.APP_ID || 'default_app_id',
  },
  reactStrictMode: true, // React Strict Mode'u aktif etmek için
};

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;

const { makeEnvPublic } = require('next-runtime-env');

makeEnvPublic('NEXT_PUBLIC_FIREBASE_API_KEY');
makeEnvPublic('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
makeEnvPublic('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
makeEnvPublic('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
makeEnvPublic('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
makeEnvPublic('NEXT_PUBLIC_FIREBASE_APP_ID');
makeEnvPublic('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID');

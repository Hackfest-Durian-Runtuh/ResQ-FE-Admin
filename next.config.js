/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        FB_APIKEY: process.env.FB_APIKEY,
        FB_AUTHDOMAIN: process.env.FB_AUTHDOMAIN,
        FB_DATABASEURL: process.env.FB_DATABASEURL,
        FB_PROJECTID: process.env.FB_PROJECTID,
        FB_STORAGEBUCKET: process.env.FB_STORAGEBUCKET,
        FB_MESSAGINGSENDERID: process.env.FB_MESSAGINGSENDERID,
        FB_APPID: process.env.FB_APPID,
        FB_FCM_SERVERKEY: process.env.FB_FCM_SERVERKEY
    }
}

module.exports = nextConfig
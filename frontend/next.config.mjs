/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    // Redirects removed for Landing Page implementation
    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/dashboard',
    //             permanent: false,
    //         },
    //     ];
    // },
};

export default nextConfig;

module.exports = {
  apps: [
    {
      name: "blackhornets",
      script: ".next/standalone/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};

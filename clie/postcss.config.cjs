// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  options: {
    from: 'src/index.css', // Set a default path for 'from'
  },
};

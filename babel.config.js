module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  // Code coverage collector for Jest fails on class properties without the
  // Babel transform 🤔
  plugins: ['@babel/plugin-proposal-class-properties'],
}

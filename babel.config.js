'use strict'

module.exports = {
  // Code coverage collector for Jest fails on class properties without the
  // Babel transform 🤔
  plugins: ['@babel/plugin-proposal-class-properties'],
}

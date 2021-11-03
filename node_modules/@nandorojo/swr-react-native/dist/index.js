
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./swr-react-native.cjs.production.min.js')
} else {
  module.exports = require('./swr-react-native.cjs.development.js')
}

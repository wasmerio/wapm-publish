/**
 * @fileoverview AVA config
 */

//Imports
const {config} = require('dotenv');

//Load .env
config();

//Export
module.exports = {
  extensions: ['ts'],
  require: ['ts-node/register']
};
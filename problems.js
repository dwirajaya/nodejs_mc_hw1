/*
 * Load chess problems from './data/problems.json'
 * 
 */

// Dependencies
var fs = require('fs');

// Read the problems in the JSON file synchronously for simplicity
var problems = JSON.parse(fs.readFileSync('./data/problems.json'));

// Export the module
module.exports = problems;

/*
 * Create and export configuration variables
 *
 * 
 */

// Container for all environments
var environments = {};

// Staging is the default environment
// Staging object
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

// Production object
environments.production = {
    'httpPort': 2288,
    'httpsPort': 2289,
    'envName': 'production'
};

// Determine which environment was passed as command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the environment exists. If not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
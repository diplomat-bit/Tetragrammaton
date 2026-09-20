'use strict'
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: [process.env.NEW_RELIC_APP_NAME || 'QuickBooks-AI-Banking-Bridge'],
  /**
   * Your New Relic license key or API user key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY || process.env.NEW_RELIC_API_KEY || 'NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE',
  /**
   * New Relic Account ID.
   */
  account_id: process.env.NEW_RELIC_ACCOUNT_ID || '4095792',
  logging: {
    /**
     * How many logs to capture. Level can be 'fatal', 'error', 'warn', 'info',
     * 'debug', or 'trace'.
     */
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info'
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a tracer's
   * specific configuration
   */
  allow_all_headers: true,
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase format to be filtered out
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*'
    ]
  },
  distributed_tracing: {
    /**
     * Enables/disables distributed tracing.
     */
    enabled: true
  }
}

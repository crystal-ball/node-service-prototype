'use strict'

/**
 * Service instance environment configs
 */
const configs = {
  port: 3000,
  pgUser: 'rad_user',
  pgPassword: 'rad_password',
  pgDatabase: 'service_db',
}

/**
 * Handle initalizing instance configs for environment
 */
const initializeConfigs = async () => {
  // Overwrite default configs with environment values if set
  ;['PORT', 'PG_USER', 'PG_PASSWORD', 'PG_DATBASE'].forEach(config => {
    const value = process.env[config]
    if (value) configs[config] = value
  })

  return configs
}

module.exports = { initializeConfigs, configs }

/* eslint-disable node/no-process-env -- Service process.env accessor */

'use strict'

const DEVELOPMENT = process.env.NODE_ENV === 'development'

class Configs {
  /**
   * Service instance environment configs, all configs are defaulted to local
   * development workflow values
   */
  configs = {
    // The environment that the app is running in, separate from NODE_ENV which
    // is used only to flip on performance optimizations
    DEPLOY_ENVIRONMENT: 'local',
    // JWT configs
    JWT_SECRET: 'hecka-secret-jwt-secret',
    // --- Service configs
    SERVICE_HOST: '0.0.0.0',
    SERVICE_PORT: 9000,
    // --- DB configs
    POSTGRES_DATABASE: 'rad_db',
    POSTGRES_HOST: 'postgres',
    POSTGRES_PASSWORD: 'rad_password',
    POSTGRES_PORT: 5432,
    POSTGRES_USER: 'rad_user',
  }

  /**
   * Handle initalizing instance configs for environment
   */
  initializeConfigs = async () => {
    // Overwrite default configs with environment values if set
    Object.keys(this.configs).forEach((config) => {
      this.configs[config] = process.env[config] || this.configs[config]
    })

    return this.configs
  }

  /**
   * Access the initialized configs
   */
  getConfigs = () => this.configs
}

const configsSingleton = new Configs()

module.exports = {
  initializeConfigs: configsSingleton.initializeConfigs,
  getConfigs: configsSingleton.getConfigs,
  DEVELOPMENT,
}

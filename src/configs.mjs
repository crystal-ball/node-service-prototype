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
    SERVICE_HOST: '127.0.0.1',
    SERVICE_PORT: 9000,
    // --- DB configs
    POSTGRES_DATABASE: 'rad_db',
    POSTGRES_HOST: 'postgres',
    POSTGRES_PASSWORD: 'rad_password',
    POSTGRES_PORT: 5432,
    POSTGRES_USER: 'rad_user',
  }

  /**
   * Access the initialized configs
   */
  getConfigs = () => this.configs

  /**
   * Updates stored configs
   */
  setConfig = (config, value) => {
    this.configs[config] = value
  }
}

const configsSingleton = new Configs()

/**
 * Handle initalizing instance configs for environment
 */
export async function initializeConfigs() {
  const defaultConfigs = configsSingleton.getConfigs()

  // Overwrite default configs with environment values if set
  Object.keys(defaultConfigs).forEach(config => {
    configsSingleton.setConfig(config, process.env[config] || defaultConfigs[config])
  })

  return configsSingleton.getConfigs()
}

export const { getConfigs } = configsSingleton

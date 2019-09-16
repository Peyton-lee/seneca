/**
 * PM2 进程管理配置
 */
const program = require('commander');

// 拦截启动选项，定制配置
program
  .option('--env', 'Process environment')
  .parse(process.argv)

const env = program.env || 'development'

module.exports = {
  apps: [
    {
      name: 'seneca-srv1',
      script: './srv1/app.js',
      kill_timeout: 5000,
      node_args: '--expose-gc',
      exec_mode: 'cluster',
      max_memory_restart: '256M',
      instances: 1,
      watch: ['node_modules', './srv1/app.js'],
      max_restarts: 10,
      combine_logs: true,
      out_file: env === 'development' ? 'logs/pm2.log' : '/dev/null',
      error_file: env === 'developmenet' ? 'logs/pm2.log' : '/dev/null',
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        NODE_PROFILES_ACTIVE: 'dev'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
}

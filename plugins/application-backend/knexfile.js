module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      database: 'backstage_plugin_application',
      password: 'postgres',
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};

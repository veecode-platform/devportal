module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      database: 'backstage_plugin_application',
      password: 'postgres',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};

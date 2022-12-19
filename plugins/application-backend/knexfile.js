module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'user',
      database: 'backstage_plugin_application',
      password: 'password',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};

// module.exports = {
//   development: {
//     client: 'pg',
//     connection: {
//       user:     'veecode',
//       password: 'yourpassword'
//     }
//   }
//   };

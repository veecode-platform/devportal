module.exports = {
  development: {
    client: 'pg',
    connection: { user: 'youruser', database: 'backstage_plugin_application', password: 'yourpassword'}
  },
  production: { 
    client: 'pg', 
    connection: process.env.DATABASE_URL 
  }
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
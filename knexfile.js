module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/smfm'
  },
  // test: {
  //   client: 'pg',
  //   connection: 'postgres://localhost/learnmorebetter_test'
  // },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}


exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments()
    t.varchar('name', 255).notNullable().defaultTo("")
    t.varchar('fb_id', 255).notNullable()
    t.boolean('is_seller').notNullable().defaultTo(false)
    t.varchar('stripe_user_id', 255)
    t.varchar('stripe_publishable_key', 255)
    t.varchar('access_token', 255)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}

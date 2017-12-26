
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', t => {
    t.increments()
    t.varchar('name', 255).notNullable().defaultTo("")
    t.varchar('fb_id', 255).notNullable()
    t.boolean('is_seller').notNullable().defaultTo(false)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}

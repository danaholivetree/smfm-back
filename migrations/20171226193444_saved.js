
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('saved', (t) => {
    t.increments()
    t.integer('user_id').notNullable().references("users.id").onDelete('cascade').index()
    t.integer('product_id').notNullable().references("products.id").onDelete('cascade').index()
    t.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saved')
};

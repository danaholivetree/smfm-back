
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bookmarks', t => {
    t.increments()
    t.integer('user_id').references('id').inTable('users').notNullable()
    t.integer('product_id').references('id').inTable('products').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('bookmarks')
};

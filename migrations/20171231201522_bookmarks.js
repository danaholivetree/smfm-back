
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bookmarks', t => {
    t.increments()
    t.integer('user_id').references('id').inTable('users').notNullable().onDelete('CASCADE')
    t.integer('product_id').references('id').inTable('products').notNullable().onDelete('CASCADE')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('bookmarks')
};

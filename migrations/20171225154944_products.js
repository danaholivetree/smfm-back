
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', t => {
    t.increments()
    t.integer('seller_id').references('id').inTable('users').onDelete("CASCADE")
    t.varchar('item_name', 255).notNullable().defaultTo("")
    t.text('category').notNullable()
    t.varchar('price', 255).notNullable().defaultTo("0.00")
    t.integer('quantity').notNullable().defaultTo(1)
    t.text('description').notNullable().defaultTo("")
    t.varchar('image_url').notNullable().defaultTo("http://res.cloudinary.com/smfm/image/upload/v1515529611/notavail.jpg")
    t.varchar('thumbnail_url').notNullable().defaultTo("http://res.cloudinary.com/smfm/image/upload/c_limit,h_100,w_150/v1515529611/notavail.jpg")
    t.boolean('sold').notNullable().defaultTo(false)
    t.integer('purchaser_id').references("id").inTable("users").onDelete("CASCADE")
    t.boolean('shipped').notNullable().defaultTo(false)
    t.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('products')
};

exports.up = function (knex) {
  return knex.schema.createTable('articles', (articleTable) => {
    // console.log('Creating Articles table');
    articleTable.increments('article_id').primary();
    articleTable.text('title').notNullable();
    articleTable.text('body').notNullable();
    articleTable.integer('votes').defaultTo(0);
    articleTable.text('topic').references('topics.slug').notNullable();
    articleTable.text('author').references('users.username').notNullable();
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  // console.log('Dropping Articles table');
  return knex.schema.dropTable('articles');
};

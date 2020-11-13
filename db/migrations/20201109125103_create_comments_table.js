exports.up = function (knex) {
  return knex.schema.createTable('comments', (commentTable) => {
    // console.log('Creating Comments table');
    commentTable.increments('comment_id').primary();
    commentTable.text('author').references('users.username').notNullable();
    commentTable
      .integer('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE');
    commentTable.integer('votes').defaultTo(0);
    commentTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentTable.text('body').notNullable();
  });
};

exports.down = function (knex) {
  // console.log('Dropping Comments table');
  return knex.schema.dropTable('comments');
};

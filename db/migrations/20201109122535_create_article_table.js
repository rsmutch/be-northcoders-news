
exports.up = function (knex) {
    return knex.schema.createTable('articles', (articleTable) => {
        console.log('Creating Articles table');
        articleTable.increments('article_id').primary();
        articleTable.text('title');
        articleTable.text('body');
        articleTable.integer('votes').defaultTo(0);
        articleTable.text('topic').references('topics.slug');
        articleTable.text('author').references('users.username');
        articleTable.timestamp('created_at');
    })
};

exports.down = function (knex) {
    console.log('Dropping Articles table');
    return knex.schema.dropTable('articles');
};

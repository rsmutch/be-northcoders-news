exports.up = function (knex) {
  return knex.schema.createTable('topics', (topicTable) => {
    // console.log('Creating Topics table');
    topicTable.text('slug').primary();
    topicTable.text('description');
  });
};

exports.down = function (knex) {
  // console.log('Dropping Topics table');
  return knex.schema.dropTable('topics');
};

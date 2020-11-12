exports.up = function (knex) {
  return knex.schema.createTable('users', (userTable) => {
    // console.log('Creating Users table');
    userTable.text('username').primary();
    userTable.text('avatar_url');
    userTable.text('name');
  });
};

exports.down = function (knex) {
  // console.log('Dropping Users table');
  return knex.schema.dropTable('users');
};

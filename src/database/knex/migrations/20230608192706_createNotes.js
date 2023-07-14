
exports.up = knex => knex.schema.createTable('notes', table => {
  table.increments('id');
  table.text('title');
  table.text('description');
  table.integer('user_id').references('id').inTable('users');//campo user_id que faz referência ao id que existe dentro da tabela users

  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable('notes');


exports.up = knex => knex.schema.createTable('tags', table => {
  table.increments('id');
  table.text('name').notNullable();
  
  table.integer('note_id').references('id').inTable('notes').onDelete('CASCADE');//ONDELETE deleta as tags vinculadas às notas
  table.integer('user_id').references('id').inTable('users');//campo user_id que faz referência ao id dentro da tabela users
 
});


exports.down = knex => knex.schema.dropTable('tags');

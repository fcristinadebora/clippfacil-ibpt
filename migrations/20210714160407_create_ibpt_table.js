
exports.up = function(knex) {
    return knex.schema.createTable('ibpt', (table) => {
        table.increments('id').primary();
        table.string('codigo');
        table.string('uf');
        table.integer("excecaoFiscal");
        table.float("nacional");
        table.float("estadual");
        table.float("importado");
        table.float("municipal");
        table.integer("tipo");
        table.string('vigenciaInicio');
        table.string('vigenciaFim');
        table.string('chave');
        table.string('versao');
        table.string('fonte');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('ibpt');
};

/** @type {import('knex').Knex} */
exports.up = async function (knex) {
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dns_record_type') THEN
        CREATE TYPE dns_record_type AS ENUM ('A', 'CNAME', 'MX', 'TXT', 'AAAA');
      END IF;
    END $$;
  `);

  await knex.schema.createTable('dns_records', (table) => {
    table.uuid('id').primary();
    table.string('hostname').notNullable();
    table.specificType('type', 'dns_record_type').notNullable();
    table.string('value').notNullable();
    table.integer('ttl').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['hostname', 'type', 'value']);
    table.index(['hostname'], 'idx_dns_records_hostname');
  });

  await knex.schema.createTable('dns_query_logs', (table) => {
    table.uuid('id').primary();
    table.string('hostname').notNullable();
    table.specificType('record_type', 'dns_record_type').notNullable();
    table.specificType('resolved_ips', 'TEXT[]').notNullable();
    table.specificType('chain', 'TEXT[]');
    table.string('client_ip').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['hostname'], 'idx_dns_query_logs_hostname');
    table.index(['created_at'], 'idx_dns_query_logs_created_at');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('dns_query_logs');
  await knex.schema.dropTableIfExists('dns_records');
  await knex.raw('DROP TYPE IF EXISTS dns_record_type');
};

import knex from 'knex';

const config = require('../../knexfile');

export const db = knex(config.development);

export const DBTableNames = {
    DNS_RECORDS: 'dns_records',
}

import * as Knex from 'knex'


exports.up = function (knex: Knex) {
	return knex.schema
		.createTable('countries', (table: Knex.TableBuilder) => {
			table.increments('id').primary()
			table.string('name').notNullable()
			table.string('country_id').notNullable()
			table.string('alpha_2').notNullable()
			table.string('alpha_3').notNullable()
			table.string('region').notNullable()
			table.string('enable').notNullable()
			table.string('currency').notNullable()
			table.string('currency_code').notNullable()
			table.string('flag').notNullable()
		})
};

exports.down = function (knex: Knex) {
	return knex.schema.dropTableIfExists('countries');
};

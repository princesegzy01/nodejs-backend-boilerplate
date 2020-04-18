
import * as Knex from 'knex'
export const up = (knex: Knex) =>
	knex.schema
		.createTable('roles', (table: Knex.TableBuilder) => {
			table.increments('id').primary()
			table.string('role').notNullable()
		})
		.createTable('users', table => {
			table.uuid('id').primary()
			table.string('first_name').notNullable(),
				table.string('last_name').notNullable(),
				table.string('email')
					// .specificType('email', 'CITEXT')
					.unique()
					.notNullable()
			table.string('password').notNullable(),
				table.string('verification_code').nullable(),
				table.string('password_reset_token').nullable()
			table.integer('role').unsigned(),
				table.integer('account_state').notNullable()
			table.timestamps(true, true)

		})

export const down = (knex: Knex) =>
	knex.schema.dropTableIfExists('users').dropTableIfExists('roles')

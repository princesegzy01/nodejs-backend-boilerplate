import Knex from 'knex'
import BookshelfUuid from 'bookshelf-uuid'
import BookshelfUpsert from 'bookshelf-upsert'

import knexConfig from '../database/knexfile'
import { NODE_ENV } from '../config'
import { InternalServerError, NotFound, BadRequest, Deleted, Conflict } from '../helpers'

const knexDevelopment: string = NODE_ENV || 'test';

let knex: any;

if (knexDevelopment === "test") {
	knex = Knex(knexConfig.test)
}

if (knexDevelopment === "development") {
	knex = Knex(knexConfig.development)
}

if (knexDevelopment === "production") {
	knex = Knex(knexConfig.production)
}
if (knexDevelopment === "staging") {
	knex = Knex(knexConfig.staging)
}

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin(BookshelfUuid)
bookshelf.plugin(BookshelfUpsert)

export const Model = (modelParams: any) =>
	bookshelf.Model.extend({
		fetchAll: function () {
			return bookshelf.Model.prototype.fetchAll
				.apply(this, arguments)
				.catch((err: any) => {
					throw InternalServerError(err.toString())
				})
		},
		fetch: async function () {
			return bookshelf.Model.prototype.fetch
				.apply(this, arguments)
				.catch((err: any) => {
					throw NotFound(err.toString())
				})
		},
		save: function () {
			return bookshelf.Model.prototype.save
				.apply(this, arguments)
				.catch((err: any) => {
					if (this.upsert) throw Conflict("An error occoured while trying to process this user")
					throw BadRequest(err.toString())
				})
		},
		upsert: function () {
			this.upsert = true
			return bookshelf.Model.prototype.upsert
				.apply(this, arguments)
				.catch((err: any) => {
					throw BadRequest(err.toString())
				})
		},
		destroy: async function () {
			await bookshelf.Model.prototype.destroy
				.apply(this, arguments)
				.catch((err: any) => {
					throw NotFound(err.toString())
				})

			return Deleted()
		},
		...modelParams
	})

export default bookshelf

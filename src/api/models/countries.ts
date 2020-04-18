import bookshelf, { Model } from '../models'

const countries = Model({
	tableName: 'countries',
	uuid: true,
	toJSON: function () {
		const { password, ...countries } = bookshelf.Model.prototype.toJSON.apply(
			this,
			arguments
		)

		return countries
	}
})

export default countries

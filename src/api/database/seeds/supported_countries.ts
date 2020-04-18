import Knex from 'knex'
export const seed = async (knex: Knex) => {
	await knex('countries').del()
	await knex('countries').insert([
		{
			country_id: "1",
			name: 'Nigeria',
			'alpha_2': 'NG',
			'alpha_3': 'NGR',
			'region': 'Africa',
			'enable': 'Yes',
			'currency': 'NGN',
			'currency_code': '',
			created_at: new Date(),
			updated_at: new Date()
		},
		{
			country_id: "2",
			name: 'Ghana',
			'alpha_2': 'NE',
			'alpha_3': 'NER',
			'region': 'Africa',
			'enable': 'Yes',
			'currency': 'GHC',
			'currency_code': 'Cedis',
			created_at: new Date(),
			updated_at: new Date()
		},
		{
			country_id: "3",
			name: 'Togo',
			'alpha_2': 'TG',
			'alpha_3': 'TGO',
			'region': 'Africa',
			'enable': 'Yes',
			'currency': 'CFA franc',
			'currency_code': 'CFA',
			created_at: new Date(),
			updated_at: new Date()
		}
	])
}

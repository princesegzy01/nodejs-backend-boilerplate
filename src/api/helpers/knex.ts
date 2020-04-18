import Knex from 'knex'

import knexConfig from '../database/knexfile'
import { NODE_ENV } from '../config'


const knexDevelopment: string = NODE_ENV || 'test';

let knex: any;

if(knexDevelopment === "test"){
	knex = Knex(knexConfig.test)
}

if(knexDevelopment === "development"){
	knex = Knex(knexConfig.development)
}

if(knexDevelopment === "production"){
	knex = Knex(knexConfig.production)
}

if(knexDevelopment === "staging"){
	knex = Knex(knexConfig.staging)
}

const DatabaseTest = {
  createDB: () => knex.migrate.latest(),
  destroyDB: () => knex.migrate.rollback(undefined, true)

}

export default DatabaseTest

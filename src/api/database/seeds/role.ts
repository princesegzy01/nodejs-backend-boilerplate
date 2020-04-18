export const seed = async (knex: any, Promise: any) => {
  await knex('roles').del()
  await knex('roles').insert([{ id: 1, role: 'admin' }])
}

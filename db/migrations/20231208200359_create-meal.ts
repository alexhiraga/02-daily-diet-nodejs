import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meal', (table) => {
        table.uuid('mealId').primary()
        table.string('owner').notNullable()
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.timestamp('time')
        table.boolean('isOnDiet').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meal')
}


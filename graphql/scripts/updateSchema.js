/* eslint no-console: 0 */
import fs from 'fs'
import path from 'path'
import { graphql } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'

// Save JSON of full schema introspection for Babel Relay Plugin to use
import { Schema } from '../data/schema'

// eslint-disable-next-line
async function updateSchema() {
  console.log('Updating schema...')
  const result = await graphql(Schema, introspectionQuery)
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    )
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../data/schema.json'),
      JSON.stringify(result, null, 2)
    )
    console.log('Schema updated.')
  }
}

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../data/schema.graphql'),
  printSchema(Schema)
)

updateSchema()

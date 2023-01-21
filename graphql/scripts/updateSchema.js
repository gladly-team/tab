/* eslint no-console: 0 */
import fs from 'fs'
import path from 'path'
import { validateSchema, graphql } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'

// Print schema for client use.
import { Schema } from '../data/schema'

function updateSchema() {
  console.log('Updating schema...')
  const errors = validateSchema(Schema)
  if (errors.length) {
    console.error('The GraphQL schema is invalid:')
    console.error(errors)
    return
  }
  console.log('The GraphQL schema is valid.')
  fs.writeFileSync(
    path.join(__dirname, '../data/schema.graphql'),
    printSchema(Schema)
  )
  console.log('Schema updated.')
}

updateSchema()

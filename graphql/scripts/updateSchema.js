/* eslint no-console: 0 */
// import fs from 'fs'
// import path from 'path'
import { validateSchema } from 'graphql'
import { printSchema } from 'graphql/utilities'

// Save JSON of full schema introspection for Babel Relay Plugin to use
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

  // FIXME: fails with "TypeError: str.replace is not a function".
  console.log(printSchema(Schema))

  // fs.writeFileSync(
  //   path.join(__dirname, '../data/schema.graphql'),
  //   printSchema(Schema)
  // )
}

updateSchema()

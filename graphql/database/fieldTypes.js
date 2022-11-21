import Joi from 'joi'
import { v4 as uuid } from 'uuid'

const customTypes = {}
customTypes.uuid = () =>
  Joi.string()
    .guid()
    .default(() => uuid(), 'uuid v4')

// Joi, with some added convenience types.
// https://github.com/hapijs/joi/blob/v10.6.0/API.md
export default Object.assign({}, Joi, customTypes)

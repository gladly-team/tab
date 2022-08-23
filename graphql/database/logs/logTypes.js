import types from '../fieldTypes'
import { VALID_SFAC_EXTENSION_BROWSERS } from '../constants'

export const SFAC_EXTENSION_PROMPT = 'SFAC_EXTENSION_PROMPT'
export const SFAC_EXTENSION_PROMPT_TYPE = types.object().keys({
  browser: types
    .string()
    .valid(VALID_SFAC_EXTENSION_BROWSERS)
    .required()
    .description(`The browser the user was on when responding to the prompt`),
  accepted: types
    .boolean()
    .required()
    .description(`Whether or not the user accepted or rejected the prompt`),
})

// When adding a new EventLog type, add it here, and to the map below
const VALID_LOG_TYPE_MAP = {
  SFAC_EXTENSION_PROMPT: SFAC_EXTENSION_PROMPT_TYPE,
}

// TODO: Automatically validate eventData on UserEventLogModel with some fancier
// Joi work. I think we can punt this for now and be careful when we add new log
// types.
export const VALID_LOG_TYPES = Object.keys(VALID_LOG_TYPE_MAP)
export const VALID_LOG_SCHEMAS = Object.values(VALID_LOG_TYPE_MAP)

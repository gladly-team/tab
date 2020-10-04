import PropTypes from 'prop-types'

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

ConditionalWrapper.propTypes = {
  condition: PropTypes.bool.isRequired,
  wrapper: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}

export default ConditionalWrapper

import React from 'react'
import logger from 'js/utils/logger'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'
import { getUrlParameters } from 'js/utils/utils'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logger.error(error)
  }

  render() {
    if (this.state.hasError) {
      const query = getUrlParameters().q || null
      return (
        <div>
          <Typography variant={'body1'} gutterBottom>
            Unable to search at this time.
          </Typography>
          <Link
            to={
              query
                ? `https://www.google.com/search?q=${encodeURI(query)}`
                : 'https://www.google.com'
            }
            target="_top"
          >
            <Button color={'primary'} variant={'contained'} size={'small'}>
              Search Google
            </Button>
          </Link>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {}
ErrorBoundary.defaultProps = {}

export default ErrorBoundary

import { useEffect } from 'react'
import { externalRedirect } from 'js/navigation/utils'

const NotFound = () => {
  useEffect(() => {
    // Rely on the 404 page from another app behind the same Cloudfront
    // distribution.
    externalRedirect('/404/')
  })
  return null
}

export default NotFound

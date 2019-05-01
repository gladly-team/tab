import React from 'react'
import PropTypes from 'prop-types'
import { range } from 'lodash/util'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'
import SearchResultItem from 'js/components/Search/SearchResultItem'
import { showBingPagination } from 'js/utils/search-utils'

const styles = theme => ({
  searchResultsParentContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  searchResultsContainer: {
    marginTop: 6,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 520,
    margin: 'auto auto 20px auto',
  },
  paginationButton: {
    minWidth: 40,
  },
  resultsAttributionContainer: {
    borderTop: '1px solid #e4e4e4',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  resultsAttribution: {
    padding: 8,
    color: '#cecece',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

const SearchResultsBing = props => {
  const {
    classes,
    data,
    isEmptyQuery,
    isError,
    isQueryInProgress,
    onPageChange,
    page,
    query,
    queryReturned,
    style,
    theme,
  } = props

  // Hiding until we make it functional.
  const SHOW_PAGINATION = showBingPagination()

  // Include 8 pages total, 4 lower and 4 higher when possible.
  // Page 9999 is the maximum, so stop there.
  const MIN_PAGE = 1
  const MAX_PAGE = 9999
  const paginationIndices = range(
    Math.max(MIN_PAGE, Math.min(page - 4, MAX_PAGE - 8)),
    Math.min(MAX_PAGE + 1, Math.max(page + 4, MIN_PAGE + 8))
  )

  const noSearchResultsReturned = queryReturned && !data.mainline.length
  const noResultsToDisplay = isEmptyQuery || !data.mainline.length || isError

  return (
    <div
      className={classes.searchResultsParentContainer}
      style={Object.assign(
        {},
        {
          // Min height prevents visibly shifting content below,
          // like the footer.
          minHeight: queryReturned || !isQueryInProgress ? 0 : 1000,
        },
        style
      )}
    >
      {isError ? (
        <div data-test-id={'search-err-msg'}>
          <Typography variant={'body1'} gutterBottom>
            Unable to search at this time.
          </Typography>
          <Link
            to={`https://www.google.com/search?q=${encodeURI(query)}`}
            target="_top"
          >
            <Button color={'primary'} variant={'contained'} size={'small'}>
              Search Google
            </Button>
          </Link>
        </div>
      ) : isEmptyQuery ? (
        <Typography variant={'body1'} gutterBottom>
          Search something to start raising money for charity!
        </Typography>
      ) : noSearchResultsReturned ? (
        <Typography variant={'body1'} gutterBottom>
          No results found for{' '}
          <span style={{ fontWeight: 'bold' }}>{query}</span>
        </Typography>
      ) : isQueryInProgress ? null : (
        <div
          data-test-id={'search-results'}
          className={classes.searchResultsContainer}
          style={{
            display: noResultsToDisplay ? 'none' : 'block',
          }}
        >
          {data.mainline.map(searchResultItemData => {
            return (
              <SearchResultItem
                key={searchResultItemData.key}
                type={searchResultItemData.type}
                itemData={searchResultItemData.value}
              />
            )
          })}
          <div
            data-test-id={'search-results-attribution'}
            className={classes.resultsAttributionContainer}
          >
            <Link
              to={'https://privacy.microsoft.com/privacystatement'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography
                variant={'caption'}
                className={classes.resultsAttribution}
              >
                Results by Microsoft
              </Typography>
            </Link>
          </div>
        </div>
      )}
      <div
        data-test-id={'pagination-container'}
        className={classes.paginationContainer}
        style={{
          display: !SHOW_PAGINATION || noResultsToDisplay ? 'none' : 'block',
        }}
      >
        {page > MIN_PAGE ? (
          <Button
            data-test-id={'pagination-previous'}
            className={classes.paginationButton}
            onClick={() => {
              onPageChange(page - 1)
            }}
          >
            PREVIOUS
          </Button>
        ) : null}
        {paginationIndices.map(pageNum => (
          <Button
            key={`page-${pageNum}`}
            className={classes.paginationButton}
            data-test-id={`pagination-${pageNum}`}
            {...pageNum === page && {
              color: 'secondary',
              disabled: true,
            }}
            style={{
              ...(pageNum === page && {
                color: theme.palette.secondary.main,
              }),
            }}
            onClick={() => {
              onPageChange(pageNum)
            }}
          >
            {pageNum}
          </Button>
        ))}
        {page < MAX_PAGE ? (
          <Button
            data-test-id={'pagination-next'}
            className={classes.paginationButton}
            onClick={() => {
              onPageChange(page + 1)
            }}
          >
            NEXT
          </Button>
        ) : null}
      </div>
    </div>
  )
}

SearchResultsBing.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.shape({
    pole: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
          .isRequired,
      })
    ).isRequired,
    mainline: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
          .isRequired,
      })
    ).isRequired,
    sidebar: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
          .isRequired,
      })
    ).isRequired,
  }).isRequired,
  isEmptyQuery: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  isQueryInProgress: PropTypes.bool.isRequired,
  queryReturned: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  style: PropTypes.object,
  theme: PropTypes.object.isRequired,
}

SearchResultsBing.defaultProps = {}

export default withStyles(styles, { withTheme: true })(SearchResultsBing)

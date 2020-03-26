// From:
// https://github.com/mui-org/material-ui/issues/12290#issuecomment-453930042
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/blog/Markdown.js
import React from 'react'
import ReactMarkdown from 'markdown-to-jsx'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

const styles = theme => ({
  listItem: {
    marginTop: 4,
  },
})

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h5',
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      )),
    },
  },
}

export default function Markdown(props) {
  return <ReactMarkdown options={options} {...props} />
}

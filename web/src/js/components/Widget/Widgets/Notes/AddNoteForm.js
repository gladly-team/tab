import React from 'react'
import PropTypes from 'prop-types'
import EditWidgetChip from '../../EditWidgetChip'

class AddNoteForm extends React.Component {
  create () {
    this.props.addNote('')
  }

  render () {
    return (
      <EditWidgetChip
        widgetName={'Notes'}
        onAddItemClick={this.create.bind(this)}
      />
    )
  }
}

AddNoteForm.propTypes = {
  addNote: PropTypes.func.isRequired
}

AddNoteForm.defaultProps = {
}

export default AddNoteForm

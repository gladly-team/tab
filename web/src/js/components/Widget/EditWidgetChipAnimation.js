import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class EditWidgetChipAnimation extends React.Component {
  render() {
    return (
      <TransitionGroup>
        {React.Children.map(this.props.children, (item, i) => {
          return item ? (
            <CSSTransition
              key={i}
              classNames="edit-widget-chip"
              appear={false}
              timeout={{
                enter: 300,
                exit: 100,
              }}
            >
              {item}
            </CSSTransition>
          ) : null
        })}
      </TransitionGroup>
    )
  }
}

export default EditWidgetChipAnimation

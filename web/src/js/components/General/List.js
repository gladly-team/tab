import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class List extends React.Component {
  
  constructor(props) {
  	super(props);
    this.container = null;
    this.state = {
      position: 0,
      containerHeight: 0,
    }
  }

  componentWillMount() {
    var node = ReactDOM.findDOMNode(this.container);
    if (node){
      this.setState({
        containerHeight: node.clientHeight,
      })
    }
  }

  onScroll(e) {
    this.setState({
      position: e.nativeEvent.target.scrollTop,
    })
  }

  getOpacity(elementIndex, scrollPosition) {
    return 1;
  }

  render() {

  	const listDefault = {
    }

    const childrenWithProps = React.Children.map(this.props.children,
     (child, index) => {
          return (
              <div 
                style={{opacity: this.getOpacity(index, this.state.position)}}>
                  {child}
              </div>
          );
     }
    );

    return (
      <div 
        ref={(container) => this.container = container}
        style={Object.assign({}, listDefault, this.props.containerStyle)}
        onScroll={this.onScroll.bind(this)}>
          {childrenWithProps}
      </div>
    );
  }
}

List.propTypes = {
	containerStyle: PropTypes.object,
}

List.defaultProps = {
	containerStyle: {}
}

class ListItem extends React.Component {
  
  render() {
    const item = {
      opacity: this.props.opacity,
    }

    return (
      <div 
        style={item}>
          {this.children}
      </div>
    );
  }
}

ListItem.propTypes = {
  children: PropTypes.object.isRequired,
  opacity: PropTypes.number,
}

ListItem.defaultProps = {
  opacity: 1
}

export {
  List,
  ListItem
};

import React from 'react';
import PropTypes from 'prop-types';
// import { CSSTransitionGroup } from 'react-transition-group';
import {Motion, spring} from 'react-motion';

class SlideFromRightAnimation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enter: false,
            set: false, 
            show: false,
            setOut: false,
            out: false,
        };
    }

    componentDidMount() {
        if(this.props.enter) {
            this.animateIn();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.enter && !nextProps.enter){
            this.animateOut();
        }
    }

    animateIn() {
        const self = this;
       
        setTimeout(function() {
            // Set enter state. Starts bubble in animation.
            self.setState({
                enter: true,
            });

            // Set timer to prepare the element to finish the animation.
            setTimeout(function() {
                // Prepares the element to render the children components after 
                // the bubbleIn animation it's over. 
                self.setState({
                    set: true,
                    enter: false,
                });

                // Set the timer to show the children components.
                setTimeout(function() {
                    self.setState({
                        show: true,
                    });
                }, 100);

            }, self.props.enterAnimationTimeout);
        }, 0);
    }

    animateOut() {
        const self = this;
        
        self.setState({
            show: false,
        });
        setTimeout(function() {
            self.setState({
                setOut: true,
            });
            setTimeout(function() {
                self.setState({
                    setOut: false,
                    out: true,
                });
            }, 100);
        }, this.props.leaveAnimationTimeout);
    }

    render() {
        var children;
        if(this.state.show){
            children = (<span>{this.props.children}</span>);
        }

        const screenWidth = screen.width + 100;

        const solid = {stiffness: 200, damping: 30};

        var style = {
            translateY: spring(screenWidth, solid),
        };
        if(this.state.enter) {
            style = {
                translateY: spring(screenWidth, solid),
            };
        }

        if(this.state.set) {
            style = {
                translateY: spring(0, solid),
            };
        }

        if(this.state.setOut) {
             style = {
                translateY: spring(0, solid),
            };
        }

        if(this.state.out) {
            style = {
                translateY: spring(screenWidth, solid),
            };
        }

        const bubbleStyle = {
            backgroundColor: 'transparent',
            position: 'absolute',
            right: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0,
        };

        return (
            <Motion style={style}>
              {({translateY}) =>
                    <div 
                        style={Object.assign({}, bubbleStyle, {
                                left: translateY,
                            })}>
                        {children}
                    </div>
              }
            </Motion>
        );
    }
}

SlideFromRightAnimation.propTypes = {
  children: PropTypes.object.isRequired,
  enter: PropTypes.bool,
  enterAnimationTimeout: PropTypes.number,
  leaveAnimationTimeout: PropTypes.number,
};

SlideFromRightAnimation.defaultProps = {
    enter: false,
    enterAnimationTimeout: 500,
    leaveAnimationTimeout: 300,
};

export default SlideFromRightAnimation;

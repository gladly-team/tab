jest.mock('material-ui/LinearProgress');

import React from 'react';
import Relay from 'react-relay';
import relayTestUtils from 'relay-test-utils';
import { mount } from 'enzyme';
import VcUserContainer from '../VcUserContainer';
 
function setup(state) {

    const fixtures = {
	  user: {
	    id: 'someId',
        vcCurrent: 50,
        vcAllTime: 100,
        level: 2,
        nextLevelHearts: {
          hearts: 200,
        }
	  }
	};
  
    const wrapper = mount(
	    relayTestUtils.relayWrap(<VcUserContainer {...fixtures} />)
	);

    return {
      output: wrapper,
    };
}

describe('VcUserContainer', function() {
    it('should render without error', function() {
      	var { output } = setup();
    });

    it('should call to update vc', function() {
    	const spy = jest.fn();
    	Relay.Store.mockCommitUpdate(spy);
      	var { output } = setup();

      	expect(spy.mock.calls[0][0].getVariables().userId).toBe('someId');
    });

    it('should display current hearts', function() {
      	var { output } = setup();
      	expect(output.find('[data-test-id="current-hearts"]').text()).toBe('50 Hearts');
    });

    it('should display the user level', function() {
      	var { output } = setup();
      	expect(output.find('[data-test-id="tabber-level"]').text()).toBe('Level 2 Tabber');
    });
});


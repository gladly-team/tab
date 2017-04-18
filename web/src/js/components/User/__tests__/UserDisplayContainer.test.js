import React from 'react';
import relayTestUtils from 'relay-test-utils';
import { mount } from 'enzyme';
import UserDisplayContainer from '../UserDisplayContainer';
 

function setup(state) {

  	const fixtures = {
	  user: {
	    id: "007",
	    username: "jamesbond",
	    email: 'jamesbond@tfac.com'
	  }
	};
  
	const output = mount(
	    relayTestUtils.relayWrap(<UserDisplayContainer {...fixtures} />)
	  );

	return {
	  output: output,
	};
}

describe('UserDisplay', function() {
    it('should render without error', function() {
      var { output } = setup();
  	  expect(output.find('h1').text()).toBe('Welcome, jamesbond');
    });
});


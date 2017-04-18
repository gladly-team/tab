jest.mock('../../database');  

import { getFeature } from '../feature';

test('fetch feature by id', () => {
	// return getFeature('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
 //    .then(feature => {
 //    	expect(feature).not.toBe(null);
 //    	expect(feature.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
 //    	expect(feature.name).toBe('React');
 //    	expect(feature.description).toBe('A JavaScript library for building user interfaces.');
 //    	expect(feature.url).toBe('https://facebook.github.io/react');
 //    });
});

test('fetch feature by id to be using param id', () => {
	// return getFeature('25cde869-7523-4605-81a6-3029651f2e10')
 //    .then(feature => {
 //    	expect(feature).not.toBe(null);
 //    	expect(feature.id).toBe('25cde869-7523-4605-81a6-3029651f2e10');
 //    	expect(feature.name).toBe('Relay');
 //    	expect(feature.description).toBe('A JavaScript framework for building data-driven react applications.');
 //    	expect(feature.url).toBe('https://facebook.github.io/relay');
 //    });
});
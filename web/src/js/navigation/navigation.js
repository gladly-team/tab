import { browserHistory } from 'react-router';

function goTo(route) {
	browserHistory.push(route);
}

export {
	goTo,
}

import { browserHistory } from 'react-router';

function goTo(route) {
	browserHistory.push(route);
}

function goToLogin() {
	goTo('/auth');
}

function goToSettings() {
	goTo('/app/settings/');
}

function goToDonate() {
	goTo('/app/donate/');
}

function goToDashboard() {
	goTo('/app/');
}

export {
	goTo,
	goToLogin,
	goToSettings,
	goToDonate,
	goToDashboard
}

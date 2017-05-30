import { browserHistory } from 'react-router';

function goTo(route) {
	browserHistory.push(route);
}

function goToLogin() {
	goTo('/auth/login/');
}

function goToSettings() {
	goTo('/tab/settings/');
}

function goToDonate() {
	goTo('/tab/donate/');
}

function goToDashboard() {
	goTo('/tab/');
}

function goToRetrievePassword() {
	goTo('/auth/recovery');
}

export {
	goTo,
	goToLogin,
	goToSettings,
	goToDonate,
	goToDashboard,
	goToRetrievePassword
}

var tfacMgr = {};

/**
 * Fetches a user ID from the database.
 * @constructor
 * @param {integer} userId - The user's ID
 * @return {integer} The number of Hearts a user has.
 */
tfacMgr.fetchUserProfile = (userId) => {
	
	/**
	 * User profile data structure.
	 * @field {string} id - The user cognito id.
	 * @field {string} email - The user's email
	 * @field {string} username - The user's TFAC username
	 * @field {integer} vcCurrent - The user's current vc
	 * @field {integer} vcAllTime - The user's all time vc
	 * @field {integer} level - The user's tabber level
	 * @field {integer} heartsUntilNextLevel - The user's heartsUntilNextLevel
	 * @field {string} backgroundOption - The user's background option.
	 * @field {string} backgroundImage - The currently selected background image name.
	 * @field {string} backgroundColor - The currently selected background color.
	 * @field {string} customImage - The currently selected custom image.
	 */
	const userProfile = {
		id: 'some-user-id',
		email: 'user@tfac.com',
		username: 'tfacuser',
		vcCurrent: 20,
		vcAllTime: 248,
		level: 4,
		heartsUntilNextLevel: 10,
		backgroundOption: 'photo', // photo | color | custom | daily
		backgroundImage: 'Mountain Lake',
		backgroundColor: '#232323',
		customImage: 'path/to/image'
	};

	return Promise.resolve(userProfile);
}

tfacMgr.fetchBookmarks = (userId) => {
	
	const bookmarks = [
		{
			name: 'Google',
			link: 'https://www.google.com/'
		},
		{
			name: 'Netflix',
			link: 'https://www.netflix.com/'
		},
		{
			name: 'Gladly',
			link: 'https://www.gladly.io/'
		}
	];

	return Promise.resolve(bookmarks);
}

tfacMgr.fetchNotes = (userId) => {
	
	const notes = [
		{
			content: 'Pick up grandma from the airport',
			color: '#00AAFF'
		},
		{
			content: 'Flight to China next week',
			color: '#AAEE22'
		}
	];

	return Promise.resolve(notes);
}

export default tfacMgr;
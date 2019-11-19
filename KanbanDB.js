"use strict;"

/**
 * 
 * @param {string} dbInstanceId If you want to persist data across instantation, pass
 * the instance ID from a previous instation. Otherwise, every time you instantiate, you
 * will have a fresh database.
 * @returns {string} Returns the instance ID if you want to reuse across instatiations.
 */
function KanbanDB(previousInstanceId, onDatabaseReady) {
	// True is uuid has been loaded via import.
	let ready = false;

	// Unique ID for this particular instance
	let dbInstanceId;

	// All localStorage items will contain this prefix
	let dataItemPrefix;

	import('https://cdnjs.cloudflare.com/ajax/libs/node-uuid/1.4.8/uuid.js')
		.then(() => {
			ready = true;
			dbInstanceId = previousInstanceId || createGUID(); 
			dataItemPrefix = `KanbanDB--${dbInstanceId}`;
			onDatabaseReady();
		});

	// wipe away any previous data unless it was requested
	if (!previousInstanceId) {
		localStorage.clear();
	}

	const CARD_STATUSES = {
		TODO: 'TODO',
		DOING: 'DOING',
		DONE: 'DONE'
	};

	function createGUID() {
		return window.uuid.v4();
	}

	function verifyDbReady() {
		if (!ready) throw new Error('Database not ready');
	}

	/**
	 * 
	 * @param {*} strDbKey 
	 * @returns {string} Key prefixed by unique database instance.
	 */
	function addPrefix(strDbKey) {
		return `${dataItemPrefix}--${strDbKey}`;
	}

	/**
	 * Verify the data structure of the card is valid for usage in database.
	 * @param {*} card 
	 * @returns {boolean}
	 */
	function isCardValid(card) {
		const isValid =
			// Card must have a name
			(typeof card.name === 'string' && card.name.length > 0)
			// If card status is provided, it must be one of the valid statuses
			&& (card.status ? Object.keys(CARD_STATUSES).indexOf(card.status) === -1 : true)
		;
		return isValid;
	}

	this.getCardById = function getCardById(strId) {
		verifyDbReady();
		const card = localStorage.getItem(addPrefix(strId));	
		if (!card) {
			throw new Error(`Card with ID ${strId} not found.`);
		}
		return JSON.parse(card);
	}

	this.getCards = function getCards() {
		verifyDbReady();
		const results = [];
		const keys = Object.keys(localStorage);
		const filtered = keys.filter((strKey) => {
			return strKey.indexOf(dataItemPrefix) > -1;
		});

		for (const key of filtered) {
			// we don't add prefix here because key is already fully qualified
			const item = localStorage.getItem(key);
			results.push(JSON.parse(item));
		}

		return results;
	}

	/**
	 * @returns {string} Returns a unique ID for the user to recall card again later.
	 */
	this.addCard = function addCard(card) {
		verifyDbReady();

		if (!isCardValid(card)) {
			throw new Error('Invalid card data.');
		}

		// We set the unique ID.
		card.id = createGUID();

		const cardKey = addPrefix(card.id);
		localStorage.setItem(cardKey, JSON.stringify(card));	

		return String(card.id);
	}

	return dbInstanceId;
}

// Export
window.KanbanDB = KanbanDB;

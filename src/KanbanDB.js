import { v4 } from 'node-uuid';

/*

A card in the database looks like:

{
  id: string;
  name: string;
  description: string;
  status: 'TODO' | 'DOING' | 'DONE';
  created: Date; // UNIX timestamp
  lastUpdated: Date; // UNIX timestamp
}
*/

/**
 *
 * @returns {string} Returns the instance ID if you want to reuse across instatiations.
 */
function KanbanDB() {
  // True is uuid has been loaded via import.
  let ready = false;

  // Unique ID for this particular instance
  let dbInstanceId;

  // All localStorage items will contain this prefix
  let dataItemPrefix;

  const CARD_STATUSES = {
    TODO: 'TODO',
    DOING: 'DOING',
    DONE: 'DONE',
  };

  function createGUID() {
    return v4();
  }

  function verifyDbReady() {
    if (!ready) throw new Error('Database not ready');
  }

  /**
   *
   * @param {string} strDbKey
   * @returns {string} Key prefixed by unique database instance.
   */
  function addPrefix(strDbKey) {
    return `${dataItemPrefix}--${strDbKey}`;
  }

  /**
   * Verify the data structure of the card is valid for usage in database.
   * @param {Card} card
   * @returns {boolean}
   */
  function isCardValid(card) {
    // Card must have a name
    const isValid = (card.name && typeof card.name === 'string' && card.name.length > 0)
      // If description is provided, it must be a strength w/ a length of at least one
      && card.description ? (typeof card.description === 'string' && card.description.length > 0) : true
      // If card status is provided, it must be one of the valid statuses
      && (card.status ? Object.keys(CARD_STATUSES).indexOf(card.status) !== -1 : true);
    return isValid;
  }

  /**
   * @returns {Promise<Card>} A single card, if found.
   */
  this.getCardById = (strId) => {
    verifyDbReady();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const card = localStorage.getItem(addPrefix(strId));
        if (!card) {
          reject(new Error(`Card with ID ${strId} not found.`));
        }
        resolve(JSON.parse(card));
      }, 100);
    });
  };

  /**
   * @returns {Promise<boolean>} true if succesful.
   */
  this.updateCardById = (strId, cardData) => {
    verifyDbReady();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // make sure card exists.
        const card = localStorage.getItem(addPrefix(strId));
        if (!card) {
          reject(new Error(`Card with ID ${strId} not found.`));
        }

        const newCard = {
          ...JSON.parse(card),
          ...cardData,
          lastUpdated: Date.now(),
        };

        if (isCardValid(newCard)) {
          localStorage.setItem(addPrefix(strId), JSON.stringify(newCard));
          resolve(true);
        } else {
          reject(new Error('New card data invalid.'));
        }
      }, 100);
    });
  };

  /**
   * @returns {Promise<boolean>} true if succesful.
   */
  this.deleteCardById = (strId) => {
    verifyDbReady();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // make sure card exists.
        const card = localStorage.getItem(addPrefix(strId));

        if (!card) {
          reject(new Error(`Card with ID ${strId} not found.`));
        }

        localStorage.removeItem(addPrefix(strId));
        resolve(true);
      }, 100);
    });
  };

  /**
   * @returns {Promise<Card[]>} An array of all cards in the database.
   */
  this.getCards = () => {
    verifyDbReady();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const results = [];
        const keys = Object.keys(localStorage);
        if (keys.length < 1) {
          reject(new Error('No data found.'));
        }
        const filtered = keys.filter((strKey) => strKey.indexOf(dataItemPrefix) > -1);

        filtered.forEach((key) => {
          // we don't add prefix here because key is already fully qualified
          const item = localStorage.getItem(key);
          results.push(JSON.parse(item));
        });

        resolve(results);
      }, 100);
    });
  };

  /**
   * @param {string[]} arrStatusCodes An array of valid status codes.
   * @returns {Promise<Card[]>} An array of all cards with specific status codes.
   */
  this.getCardsByStatusCodes = (arrStatusCodes) => {
    verifyDbReady();

    return new Promise((resolve, reject) => {
      let i;
      for (i = 0; i < arrStatusCodes.length; i += 1) {
        if (Object.keys(CARD_STATUSES).indexOf(arrStatusCodes[i]) === -1) {
          reject(new Error('Invalid status'));
        }
      }

      setTimeout(() => {
        const results = [];

        this.getCards().then((arrCards) => {
          arrCards.forEach((card) => {
            if (arrStatusCodes.indexOf(card.status) !== -1) {
              results.push(card);
            }
          });

          resolve(results);
        });
      }, 100);
    });
  };

  /**
   * @returns {Promise<string>} A unique ID for the user to recall card again later.
   */
  this.addCard = (cardData) => {
    verifyDbReady();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // We set the unique ID.
        const card = {};
        card.id = createGUID();
        card.name = cardData.name;
        card.description = cardData.description;
        card.status = cardData.status;
        card.created = Date.now();
        card.lastUpdated = Date.now();

        if (!isCardValid(card)) {
          reject(new Error('Invalid card data.'));
        }

        const cardKey = addPrefix(card.id);
        localStorage.setItem(cardKey, JSON.stringify(card));
        resolve(String(card.id));
      }, 100);
    });
  };

  /**
   * @param {string} previousInstanceId If you want to persist data across instantation, pass
   * the instance ID from a previous instantiation. Otherwise, every time you instantiate, you
   * will have a fresh database.
   * @returns {Promise} A handle to the KanbanDB instance.
   */
  this.connect = (previousInstanceId) => new Promise((resolve) => {
    ready = true;
    dbInstanceId = previousInstanceId || createGUID();

    // wipe away any previous data unless it was requested
    if (!previousInstanceId) {
      localStorage.clear();
    }

    dataItemPrefix = `KanbanDB--${dbInstanceId}`;

    resolve(this);
  });

  // It just nullifies instance.
  this.disconnect = () => new Promise((resolve) => {
    ready = false;
    dbInstanceId = null;
    dataItemPrefix = null;
    resolve(true);
  });

  // Instance handle.
  return this;
}

export default new KanbanDB();

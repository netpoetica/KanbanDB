/* eslint-env jest */
import KanbanDB from '../src/KanbanDB';

let db;
test('.connect() should return db instance', async () => {
  db = await KanbanDB.connect();
  expect(typeof db.addCard).toBe('function');
});

test('should add and get cards from database', async () => {
  const cards = [
    { name: 'helloworld' },
    { name: 'abcdef', status: 'TODO' }
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const card of cards) {
    // eslint-disable-next-line no-await-in-loop
    const cardId = await db.addCard(card);
    expect(typeof cardId).toBe('string');

    // eslint-disable-next-line no-await-in-loop
    const cardData = await db.getCardById(cardId);
    expect(cardData.name).toBe(card.name);
    expect(cardData.status).toBe(card.status);
  }

  const allCards = await db.getCards();
  expect(allCards.length).toBe(cards.length);
});

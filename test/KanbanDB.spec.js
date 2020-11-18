/* eslint-env jest */
import KanbanDB from '../src/KanbanDB';

test('public API should be as per documentation', async () => {
  const db = await KanbanDB.connect();
  expect(typeof db.getCards).toBe('function');
  expect(typeof db.getCardsByStatusCodes).toBe('function');
  expect(typeof db.getCardById).toBe('function');
  expect(typeof db.addCard).toBe('function');
  expect(typeof db.updateCardById).toBe('function');
  expect(typeof db.deleteCardById).toBe('function');
});

test('should be able to re-use previous instanceID to keep localstorage alive', async () => {
  const db = await KanbanDB.connect();
  const instanceId = db.getInstanceId();
  const newDb = await KanbanDB.connect(instanceId);
  expect(newDb.getInstanceId()).toBe(instanceId);
});

test('should connect, add, get cards from database, and delete', async () => {
  const db = await KanbanDB.connect();
  expect(typeof db.addCard).toBe('function');

  const cards = [
    { name: 'helloworld' },
    { name: 'abcdef', status: 'TODO', description: 'early alphabet' },
    { name: 'goodbyeworld', status: 'DONE' },
    { name: 'xyz', status: 'DONE', description: 'late alphabet' },
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const card of cards) {
    // eslint-disable-next-line no-await-in-loop
    const cardId = await db.addCard(card);
    expect(typeof cardId).toBe('string');

    // eslint-disable-next-line no-await-in-loop
    const cardData = await db.getCardById(cardId);
    expect(cardData.name).toBe(card.name);
    expect(cardData.description).toBe(card.description);
    expect(typeof cardData.created).toBe('number');
    expect(typeof cardData.lastUpdated).toBe('number');
    expect(cardData.status).toBe(card.status);
  }

  let allCards = await db.getCards();
  expect(allCards.length).toBe(cards.length);

  let cardsThatAreTodoStatus = await db.getCardsByStatusCodes(['TODO']);
  expect(cardsThatAreTodoStatus.length).toBe(1);

  const cardsThatAreDoneStatus = await db.getCardsByStatusCodes(['DONE']);
  expect(cardsThatAreDoneStatus.length).toBe(2);

  const cardsThatAreDoneAndTodoStatus = await db.getCardsByStatusCodes(['DONE', 'TODO']);
  expect(cardsThatAreDoneAndTodoStatus.length).toBe(3);

  // Update status of TODO card to done
  const card = cardsThatAreTodoStatus[0];
  card.status = 'DONE';
  const bResult = await db.updateCardById(card.id, card);
  expect(bResult).toBe(true);
  const newCard = await db.getCardById(card.id);
  expect(newCard.status).toBe('DONE');

  cardsThatAreTodoStatus = await db.getCardsByStatusCodes(['TODO']);
  expect(cardsThatAreTodoStatus.length).toBe(0);

  // should be able to delete cards
  const deleteResult = await db.deleteCardById(card.id);
  expect(deleteResult).toBe(true);
  try {
    await db.getCardById(card.id);
  } catch (e) {
    expect(typeof e.message).toBe('string');
  }
  allCards = await db.getCards();
  // -1 because we just deleted
  expect(allCards.length).toBe(cards.length - 1);

  const disconnected = await db.disconnect();
  expect(disconnected).toBe(true);

  // once disconnected, things should throw
  try {
    await db.getCardById(card.id);
  } catch (e) {
    // It should have thrown
    expect(typeof e.message).toBe('string');
  }
});

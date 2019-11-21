KanbanDB
========

This repo is a dummy database library for front-end developer testing (interviewing).

This database uses localStorage in the background, but it is meant to emulate a front-end database client
like FireBase, for example, allowing you to perform CRUD operations on Kanban board items.

## Public API

| Function  | Description  |
|---|---|
| connect()   | Return instance of connected db |
| getCards()  | Return all cards  |
| getCardsByStatusCodes(arr)  | Get cards matching status codes passed in array. Valid status codes are 'TODO', 'DOING', and 'DONE'. Example `getCardByStatusCodes(['TODO','DOING'])`  |
| getCardById(id)  | Returns a single card if it exists in DB   |
| addCard(cardData)  | Add card to database. An ID will be generated for you. Valid card properties are `name (string)`, `description (string)`, and `status(string)`   |
| updateCard(id, cardData)  | Returns true if succesful. Last updated timestamp will be increased  |
| deleteCard(id)  | Returns true if succesful. Will throw an error if card with ID does not exist.|


## Card Data Structure

A card in the database has the following structure:

```
{
  id: string;
  name: string;
  description?: string;
  status: 'TODO' | 'DOING' | 'DONE';
  created: Date; // UNIX timestamp
  lastUpdated: Date; // UNIX timestamp
}
```

## Usage Example

You can include KanbanDB directly as a JS script in your HTML file, or you can import it for usage in an app
that uses a bundler like webpack:

```
<script src="./dist/KanbanDB.js" type="text/javascript"></script>
<script type="text/javascript">
    KanbanDB.connect()
</script>
```

or

```
import KanbanDB from 'KanbanDB';
KanbanDB.connect();
```

Using with promises

```
KanbanDB
    .connect()
    .then(function ready(db, dbInstanceId) {
        // Add some cards
        db.addCard({ name: 'Update node modules' })
            .then(cardId => console.log('card added with ID ' + cardId))
            .catch(err => console.error(err.message));

        // Get all cards
        db.getCards()
            .then((cards) => {
                console.log('all cards from DB (should have new records)', cards);

                // Get an individual card where you know it's ID
                db.getCardById(cards[0].id)
                    .then(card => console.log('card data', card))
                    .catch(err => console.error(err.message));
            })
            .catch((err) => {
                console.error('error', err.message);
            });

    });
```

Using async/await 

```
const db = await KanbanDB.connect();

try {
    const cardId = await db.addCard({
        name: 'Update node modules'
    });
    console.log('card added with ID ' + cardId)

    // Get all cards
    const cards = await db.getCards();
    console.log('all cards from DB (should have new records)', cards);

    // Get an individual card where you know it's ID
    const card = await db.getCardById(cardId);
    console.log('card data', card);
} catch (err) {
    console.error(err.message);
}
```
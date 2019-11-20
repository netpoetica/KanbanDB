KanbanDB
=======

This repo is a dummy database library for front-end developer testing (interviewing).

# Usage Example

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
# Frontend Development final assessment: Flashcards-o-matic
This web application provides functionality to create, edit and delete Decks of cards for study purposes.

> Once the cards are created, you can choose a Deck and start studying, enjoy!

## Troubleshooting
There is a [known issue #568](https://github.com/typicode/json-server/issues/568) caused by json-server for DELETE operations results in **HTTP 500 Internal Server Error**.
The operations is completed and the record is deleted, but the "*TypeError: Cannot read properties of null when DELETE request is sent*" error is returned.

> The current implementation is bypassing this problem by adding (error) => {} and handle the errros accordingly.
> However, this does not prevent the "HTTP 500 Internal Server Error" from happening when using any of the DELETE operations
> provided by utils/api/index.js (outside of the scope of the assessment).

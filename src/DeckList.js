import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { listDecks, deleteDeck } from './utils/api/index';

function DeckList() {
    const [decks, setDecks] = useState({});
  const navigate = useNavigate();

  // Handlers
  const clickHander = () => {
    navigate("/decks/new");
  }

  const viewHandler = (deckId) => {
    navigate(`/decks/${deckId}`);
  }

  const deleteHandler = (deckId) => {

    if(window.confirm("Delete this deck?\n\nYou will not be able to recover it.")) {
      setDecks(decks.filter((deck) => deck.id !== deckId));      
      const abortSignal = new AbortController();

      // Known issue #568: HTTP 500 Internal Server Error
      // https://github.com/typicode/json-server/issues/568
      // TypeError: Cannot read properties of null when DELETE request is sent
      const response = deleteDeck(deckId, abortSignal.signal);

      // Temporal workaround until issue #568 is fixed (catching the error)
      response.then(() => {},(error) => {});
    }
  }

  const studyHandler = (deckId) => {
    navigate(`/decks/${deckId}/study`);
  }

  useEffect(() => {
    const abortController = new AbortController(); 
    const response = listDecks(abortController.signal);

    response.then(
      (results) => {
          setDecks(results);
      },
      (error) => {
          console.error(error);
      }
  );
  },[]);

  let items;

  if(!decks && Object.keys(decks).length === 0) {
    // items = <NotFound />;
  }
  else {
    // TODO: Check why value.cards.length is causing TypeError: Cannot read properties of undefined (reading 'length') in UNITEST
    // I believe this is because MOCK is returning a single OBJECT rather than an ARRAY of OBJECTs.

    items = Object.entries(decks).map(([key, value], index) => (
      <div key={index} className="flashcard">
        <div className="flashcard-header">
          <label className="flashcard-header-title">{value.name}</label>
          <label>{value.cards.length} cards</label> 
        </div>
        <div>
          <label>{value.description}</label>
        </div>
        <div className="flashcard-actions">
          <div>
            {/* <input type="button" value="view" onClick={() => viewHandler(value.id)} /> */}
            <button type="button" className="btn btn-secondary" onClick={() => viewHandler(value.id)}>View</button>
            {/* <input type="button" value="study" onClick={() => studyHandler(value.id)}/> */}
            <button type="button" className="btn btn-primary" onClick={() => studyHandler(value.id)}>Study</button>
          </div>
          <div>
            {/* <input type="button" value="delete" onClick={() => deleteHandler(value.id)} /> */}
            <button type="button" className="btn btn-danger" onClick={() => deleteHandler(value.id)}>Delete</button>
          </div>
        </div>
      </div>
    ));
  }

  return(
    <>
        <div className="deck-create">
            <button type="button" className="btn btn-secondary" onClick={clickHander}>Create Deck</button>
        </div>
        {/* <input type="button" value="Create Deck" onClick={clickHander}/> */}
        <div>{items}</div>
    </>
  );
}

export default DeckList
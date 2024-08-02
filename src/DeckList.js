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

  const items = Object.entries(decks).map(([key, value], index) => (
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
          <button type="button" className="btn btn-secondary" onClick={() => viewHandler(value.id)}>View</button>
          <button type="button" className="btn btn-primary" onClick={() => studyHandler(value.id)}>Study</button>
        </div>
        <div>
          <button type="button" className="btn btn-danger" onClick={() => deleteHandler(value.id)}>Delete</button>
        </div>
      </div>
    </div>
  ));

  return(
    <div className="container">
        <div className="decklist-create">
            <button type="button" className="btn btn-secondary" onClick={clickHander}>Create Deck</button>
        </div>
        <div>{items}</div>
    </div>
  );
}

export default DeckList
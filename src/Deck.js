import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { readDeck, deleteCard, deleteDeck } from './utils/api/index';

import NavigationMenu from "./NavigationMenu";
import Card from "./Card";

function Deck() {
    const navigate = useNavigate();
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);

    // Card Operations
    const removeCard = (cardId) => {
        setCards(cards.filter((card, index) => card.id !== cardId));
        const abortSignal = new AbortController();

        // Known issue #568: HTTP 500 Internal Server Error
        // https://github.com/typicode/json-server/issues/568
        // TypeError: Cannot read properties of null when DELETE request is sent
        const response = deleteCard(cardId, abortSignal.signal);

        // Temporal workaround until issue #568 is fixed (catching the error)
        response.then(() => {},(error) => {});
    }

    // Handlers
    const deckEditHandler = () => {
        navigate(`/decks/${deckId}/edit`);
    }

    const deckStudyHandler = () => {
        navigate(`/decks/${deckId}/study`);
    }

    const deckAddCardsHandler = () => {
        navigate(`/decks/${deckId}/cards/new`);
    }

    const deckDeleteHandler = () => {

        if(window.confirm("Delete this deck?\n\nYou will not be able to recover it.")) {
            const abortSignal = new AbortController();
    
            // Known issue #568: HTTP 500 Internal Server Error
            // https://github.com/typicode/json-server/issues/568
            // TypeError: Cannot read properties of null when DELETE request is sent
            const response = deleteDeck(deckId, abortSignal.signal);
            response.then(
                () => {
                    navigate("/");
                },
                (error) => {
                    navigate("/"); // Temporal workaround until issue #568 is fixed.
                }
            );
        }
    }

    useEffect(() => {
        const response = readDeck(deckId);
        response.then(
            (results) => {
                setDeck(results);
                setCards(results.cards);
            },
            (error) => {
                console.error(error);
            }
        );
    }, [deckId]);

    // TODO: Remove!
    // This should not happen though...
    if(deck && Object.keys(deck).length === 0) {
        return <p>Loading...</p>;
    }

    const items = cards.map((card, index) => (
        <Card key={index} card={card} removeCard={() => removeCard(card.id)}/>
    ));

    // Navigation Menu
    const links = [
        ["Home", "/"],
        [`${deck.name}`, ""]
    ];

    return (
        <>
            <NavigationMenu links={links}/>
            <div className="decks-view">
                <h1>{deck.name}</h1>
                <p>{deck.description}</p>
                <div className="decks-view-actions">
                    <div>
                        {/* <input type="button" value="Edit" onClick={deckEditHandler}/>
                        <input type="button" value="Study" onClick={deckStudyHandler}/>
                        <input type="button" value="Add Cards" onClick={deckAddCardsHandler}/> */}

                        <button type="button" className="btn btn-secondary" onClick={deckEditHandler}>Edit</button>
                        <button type="button" className="btn btn-primary" onClick={deckStudyHandler}>Study</button>
                        <button type="button" className="btn btn-primary" onClick={deckAddCardsHandler}>Add Cards</button>
                    </div>
                    <div>
                        {/* <input type="button" value="Delete" onClick={deckDeleteHandler}/> */}
                        <button type="button" className="btn btn-danger" onClick={deckDeleteHandler}>Delete</button>
                    </div>
                </div>
            </div>
            <div className="decks-cards-view">
                <h2>Cards</h2>
                <div>
                    { !items ? null : items}
                </div>
            </div>
        </>
    );
}

export default Deck;
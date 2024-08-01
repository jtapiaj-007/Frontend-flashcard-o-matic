import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { readDeck } from './utils/api/index';

import NavigationMenu from './NavigationMenu';

function Study() {
    const [index, setIndex] = useState(0);
    const [isFront, setIsFront] = useState(true);
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const { deckId } = useParams();
    const navigate = useNavigate();

    // Handlers
    const flipHandler = () => {
        setIsFront(!isFront);
    }

    const nextCardHandler = () => {
        setIndex(index + 1);
        setIsFront(true);

        if(index === cards.length - 1) {
            // TODO: see the Restart prompt section!!
            if(window.confirm("Restart cards?\n\nClick 'cancel' to return to the home page.")) {
                setIndex(0);
            }
            else {
                navigate('/');
            }
        }
    }

    const deckAddCardsHandler = () => {
        navigate(`/decks/${deckId}/cards/new`);
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

    // Navigation Menu
    const links = [
        ["Home", "/"],
        [`${deck.name}`, `/decks/${deckId}`],
        ["Study", ""]
    ];

    // Scenario #1: When there is less than the minium of 3 Cards
    if(cards.length < 3) {
        return(
            <>
                <NavigationMenu links={links}/>
                <h1>Study: {deck.name}</h1>
                <div>
                    <h2>Not enough cards.</h2>
                    <p>You need at least 3 cards to study. There are {cards.length} cards in this deck.</p>
                </div>
                {/* <input type="button" value="Add Cards" onClick={deckAddCardsHandler}/> */}
                <button type="button" className="btn btn-primary" onClick={deckAddCardsHandler}>Add Cards</button>
            </>
        );
    }

    // Sceanrio #2: When there is more than the minium of 3 Cards
    let card;

    if(isFront) {
        card = (
            <div className="study-card">
                <div className="study-card-title">Card {index + 1} of {cards.length}</div>
                <div>{cards[index].front}</div>
                <div className="study-card-actions">
                    <button type="button" className="btn btn-secondary" onClick={flipHandler}>Flip</button>
                </div>
            </div>
        );
    }
    else {
        card = (
            <div className="study-card">
                <div className="study-card-title">Card {index + 1} of {cards.length}</div>
                <div>{cards[index].back}</div>
                {/* <div><input type="button" value="Flip" onClick={flipHandler}/></div> */}
                {/* <div><input type="button" value="Next" onClick={nextCardHandler}/></div> */}

                <div className="study-card-actions">
                    <button type="button" className="btn btn-secondary" onClick={flipHandler}>Flip</button>
                    <button type="button" className="btn btn-primary" onClick={nextCardHandler}>Next</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavigationMenu links={links}/>
            <h1>Study: {deck.name}</h1>
            <div>{card}</div>
        </>
    );
}

export default Study;
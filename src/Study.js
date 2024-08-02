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
                <div className="container">
                    <h1>Study: {deck.name}</h1>
                    <div>
                        <h2>Not enough cards.</h2>
                        <p>You need at least 3 cards to study. There are {cards.length} cards in this deck.</p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={deckAddCardsHandler}>Add Cards</button>
                </div>
            </>
        );
    }

    // Sceanrio #2: When there is more than the minium of 3 Cards
    let cardContent;

    if(isFront) {
        cardContent = (
            <>
                <div>{cards[index].front}</div>
                <div className="study-card-actions">
                    <button type="button" className="btn btn-secondary" onClick={flipHandler}>Flip</button>
                </div>
            </>
        );
    }
    else {
        cardContent = (
            <>
                <div>{cards[index].back}</div>
                <div className="study-card-actions">
                    <button type="button" className="btn btn-secondary" onClick={flipHandler}>Flip</button>
                    <button type="button" className="btn btn-primary" onClick={nextCardHandler}>Next</button>
                </div>
            </>
        );
    }

    return (
        <>
            <NavigationMenu links={links}/>
            <div className="container">
                <h1>Study: {deck.name}</h1>
                <div className="study-card">
                    <div className="study-card-title">Card {index + 1} of {cards.length}</div>
                    {cardContent}
                </div>
            </div>
        </>
    );
}

export default Study;
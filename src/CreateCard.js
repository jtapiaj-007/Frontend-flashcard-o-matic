import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { createCard, readDeck, updateCard } from './utils/api/index';
import NavigationMenu from "./NavigationMenu";

function CreateCard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { deckId, cardId } = useParams();
    const [formData, setFormData] = useState({});
    const [card, setCard] = useState({});
    const [deck, setDeck] = useState({});
    const isNewRequest = location.pathname.includes('/cards/new');
    const viewTitle = isNewRequest ? 'Add Card' : 'Edit Card'; // The preview does not include the Deck title
    const cancelOrDone = isNewRequest ? 'Done' : 'Cancel';
    const saveOrSubmit = isNewRequest ? 'Save' : 'Submit';

    const goBack = () => {
        navigate(`/decks/${deckId}`);
    }

    const changeHandler = (e) => {
        setFormData({
                ...formData,
                [e.target.name]: e.target.value
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const abortSignal = new AbortController();

        // CREATE
        if(isNewRequest) {
            const response = createCard(deckId, formData, abortSignal.signal);
            response.then(
                (results) => {
                    setFormData({ front: "", back: "" }); // Reset FORM fields
                },
                (error) => {
                    console.error(error);
                }
            );
        }

        // UPDATE
        else {
            const updatedCard = { ...card, front: formData.front, back: formData.back };
            const response = updateCard(updatedCard, abortSignal.signal);

            response.then(
                () => {
                    navigate(`/decks/${deckId}`);
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }

    // Loading Deck information
    useEffect(() => {
        const response = readDeck(deckId);
        response.then(
            (results) => {
                setDeck(results);
                setCard(results.cards);

                if(!isNewRequest) {
                    const singleCard = results.cards.filter(card => card.id == cardId);

                    setFormData({
                        front: singleCard[0].front, 
                        back: singleCard[0].back 
                    });
                    setCard(singleCard[0]);
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }, [deckId, cardId, isNewRequest]);

    // Navigation Menu
    const links = isNewRequest
    ? [["Home", "/"], [`${deck.name}`, `/decks/${deckId}`], [`${viewTitle}`, ""]]
    : [["Home", "/"], [`${deck.name}`, `/decks/${deckId}`], [`${viewTitle} ${cardId}`, ""]];

    return(
        <div>
            <NavigationMenu links={links}/>
            <h1>{deck.name}: {viewTitle}</h1>
            <form className="form-create-card">
                <label htmlFor="front">Front</label>
                <br />
                <textarea
                    name="front"
                    id="front"
                    onChange={changeHandler}
                    value={formData.front}
                    placeholder='Front side of card'/>
                <br />
                <label htmlFor="back">Back</label>
                <br />
                <textarea
                    name="back"
                    id="back"
                    onChange={changeHandler}
                    value={formData.back}
                    placeholder='Back side of card'/>
                <div className="card-actions">
                    {/* <input type="button" value={cancelOrDone} onClick={goBack}/>
                    <input type="button" value={saveOrSubmit} onClick={submitHandler}/> */}

                    <button type="button" className="btn btn-secondary" onClick={goBack}>{cancelOrDone}</button>
                    <button type="button" className="btn btn-primary" onClick={submitHandler}>{saveOrSubmit}</button>
                </div>
            </form>
        </div>
    );
}

export default CreateCard;
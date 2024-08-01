import React from'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { createDeck, readDeck, updateDeck } from './utils/api/index';
import NavigationMenu from './NavigationMenu';

// TODO: loading the page is causing a WARNING: 
// A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from
// undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input 
// element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components.

function CreateDeck() {
    const location = useLocation();
    const navigate = useNavigate();
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [formData, setFormData] = useState({});
    const isNewRequest = location.pathname.includes('/decks/new');
    const viewTitle = isNewRequest ? "Create Deck" : "Edit Deck";

    const goBack = () => {
        if(isNewRequest) {
            navigate('/');
        }
        else {
            navigate(`/decks/${deckId}`);
        }
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
            const response = createDeck(formData, abortSignal.signal);

            response.then(
                (results) => {
                    navigate(`/decks/${results.id}`);
                },
                (error) => {
                    console.error(error);
                }
            );
        }

        // UPDATE
        else {
            const updatedDeck = { ...formData, id: deckId };
            const response = updateDeck(updatedDeck, abortSignal.signal);

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

    useEffect(() => {
        if(!isNewRequest) {
            const response = readDeck(deckId);

            response.then(
                (results) => {
                    setFormData({ name: results.name, description: results.description });
                    setDeck(results);
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }, [deckId, isNewRequest]);

    // Navigation Menu
    const links = isNewRequest
        ? [["Home", "/"], [`${viewTitle}`, ""]]
        : [["Home", "/"], [`${deck.name}`, `/decks/${deckId}`], [`${viewTitle}`, ""]];

    return (
        <>
            <NavigationMenu links={links}/>
            <div>
                <h1>{viewTitle}</h1>
                <form className='form-deck'>
                    <label htmlFor='name'>Name</label>
                    <br/>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        onChange={changeHandler}
                        value={formData.name}
                        placeholder='Deck Name'
                    />
                    <br/>
                    <label htmlFor='description'>Description</label>
                    <br/>
                    <textarea
                        name='description'
                        id='description'
                        onChange={changeHandler}
                        value={formData.description}
                        placeholder='Brief description of the deck'
                    />
                    <br/>
                    {/* <input type='button' value='Cancel' onClick={goHome} />
                    <input type='submit' value='Submit'/> */}
                    <div className='deck-create-actions'>
                        <button type="button" className="btn btn-secondary" onClick={goBack}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={submitHandler}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateDeck;
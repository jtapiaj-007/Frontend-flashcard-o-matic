import React from'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { createDeck, readDeck, updateDeck } from './utils/api/index';
import NavigationMenu from './NavigationMenu';

function CreateDeck() {
    const location = useLocation();
    const navigate = useNavigate();
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [formData, setFormData] = useState({ name: "", description: "" });
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

    const create = () => {
        const abortSignal = new AbortController();
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

    const update = () => {
        const abortSignal = new AbortController();
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

    // Handlers
    const changeHandler = (e) => {
        setFormData({
                ...formData,
                [e.target.name]: e.target.value
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(isNewRequest) {
            create();
        }
        else {
            update();
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
            <div className='container'>
                <h1>{viewTitle}</h1>
                <form className='deckcreate-form'>
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
                    <div className='deckcreate-actions'>
                        <button type="button" className="btn btn-secondary" onClick={goBack}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={submitHandler}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateDeck;
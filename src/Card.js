import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function Card({card, removeCard }) {
    const navigate = useNavigate();
    const { deckId, cardId } = useParams();

    const editHandler = () => {
        navigate(`/decks/${deckId}/cards/${card.id}/edit`);
    }

    const deleteHandler = () => {
        if(window.confirm("Delete this card?\n\nYou will not be able to recover it.")) {
            removeCard();
        }
    }

    return(
        <div className="decks-card">
            <div className="deck-card-content">
                <div>{card.front}</div>
                <div>{card.back}</div>
            </div>
            <div className="decks-cards-view-actions">
                {/* <input type="button" value="Edit" onClick={editHandler}/>
                <input type="button" value="Delete" onClick={deleteHandler}/> */}

                <button type="button" className="btn btn-secondary" onClick={editHandler}>Edit</button>
                <button type="button" className="btn btn-danger" onClick={deleteHandler}>Delete</button>
            </div>
        </div>
    );
}

export default Card;
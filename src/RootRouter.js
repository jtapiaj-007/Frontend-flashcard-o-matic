import React from 'react';
import { Routes, Route } from "react-router-dom";

import CreateCard from './CreateCard';
import CreateDeck from './CreateDeck';
import Deck from './Deck';
import DeckList from './DeckList';
import NotFound from './Layout/NotFound';
import Study from './Study';

function RootRouter() {
    return (
        <Routes>
            <Route path="/">
                <Route path='' element={<DeckList />} />
                <Route path="decks/new" element={<CreateDeck />} />
                <Route path="decks/:deckId/edit" element={<CreateDeck />} />
                <Route path="decks/:deckId/study" element={<Study />} />
                <Route path="decks/:deckId/cards/new" element={<CreateCard />} />
                <Route path="decks/:deckId" element={<Deck />} />
                <Route path="decks/:deckId/cards/:cardId/edit" element={<CreateCard />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default RootRouter;
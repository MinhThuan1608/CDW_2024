import React, { createContext, useReducer } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WaitRoom from "./pages/WaitRoom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateCharacter from "./pages/CreateCharacter";
import GamePage from "./pages/GamePage";
import AppContext from "./contexts/Context";
import { initGameState } from "./components/gameBoard/constants";
import {reducer} from "./reducer/reducer";

export const SocketContext = createContext();


function App() {
  const [appState, dispatch] = useReducer(reducer, initGameState)
  const providerState = {
    appState,
    dispatch
  }
  const providerState2 = {
    appState,
    dispatch
  }
  return (
    <SocketContext.Provider value={providerState2}> 

    <AppContext.Provider value={providerState}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wait-room" element={<WaitRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-character" element={<CreateCharacter />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
    </SocketContext.Provider>

  );
}

export default App;

import React from 'react';
import { ChatContextProvider } from './context/chatContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Home from './pages/Home';
import SignIn from './pages/SignIn';

function App() {
    const [user] = useAuthState(auth);
    return (
        <ChatContextProvider>
            <div>{user ? <Home /> : <SignIn />}</div>
        </ChatContextProvider>
    );
}

export default App;

import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext, IChatContext } from '../context/chatContext';
import { auth } from '../firebase';
import Thinking from './Thinking';

const ChatView = () => {
    const messagesEndRef = useRef<any>();
    const inputRef = useRef<any>();
    const [formValue, setFormValue] = useState('');
    const [thinking, setThinking] = useState(false);
    const options = ['ChatGPT', 'DALL·E'];
    const [selected, setSelected] = useState(options[0]);
    const { messages, setMessages, setLimit } = useContext(
        ChatContext
    ) as IChatContext;
    const user = auth.currentUser?.uid;
    const picUrl =
        auth.currentUser?.photoURL ||
        'https://api.adorable.io/avatars/23/abott@adorable.png';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const updateMessage = (newValue: string, ai = false, selected: any) => {
        const id = Date.now() + Math.floor(Math.random() * 1000000);
        const newMsg = {
            id: id,
            createdAt: Date.now(),
            text: newValue,
            ai: ai,
            selected: `${selected}`,
        };

        setMessages(newMsg);
    };

    const sendMessage = async (e: any) => {
        e.preventDefault();

        const newMsg = formValue;
        const aiModel = selected;

        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const PATH = aiModel === options[0] ? 'davinci' : 'dalle';
        const POST_URL = BASE_URL + PATH;

        setThinking(true);
        setFormValue('');
        updateMessage(newMsg, false, aiModel);

        const response = await fetch(POST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: newMsg,
                user: user,
            }),
        });

        const data = await response.json();
        setLimit(data.limit);

        console.log(response.status);
        if (response.ok) {
            // The request was successful
            data.bot && updateMessage(data.bot, true, aiModel);
        } else if (response.status === 429) {
            setThinking(false);
        } else {
            // The request failed
            window.alert(`openAI is returning an error: ${
                response.status + response.statusText
            } 
      please try again later`);
            console.log(`Request failed with status code ${response.status}`);
            setThinking(false);
        }

        setThinking(false);
    };

    /**
     * Scrolls the chat area to the bottom when the messages array is updated.
     */
    useEffect(() => {
        scrollToBottom();
    }, [messages, thinking]);

    /**
     * Focuses the TextArea input to when the component is first rendered.
     */
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="chatview">
            <main className="chatview__chatarea">
                {messages.map((message: any, index: number) => (
                    <ChatMessage key={index} message={{ ...message, picUrl }} />
                ))}

                {thinking && <Thinking />}

                <span ref={messagesEndRef}></span>
            </main>
            <form className="form" onSubmit={sendMessage}>
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="dropdown"
                >
                    <option>{options[0]}</option>
                    <option>{options[1]}</option>
                </select>
                <textarea
                    ref={inputRef}
                    className="chatview__textarea-message"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                />
                <button
                    type="submit"
                    className="chatview__btn-send"
                    disabled={!formValue}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatView;

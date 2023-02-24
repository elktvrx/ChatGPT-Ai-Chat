import React, { createContext, FC, ReactNode, useState } from 'react';
import useMessageCollection from '../hooks/useMessageCollection';

type Props = {
    children: ReactNode | ReactNode[];
};

export interface IChatContext {
    messages: any;
    setMessages: any;
    clearMessages: any;
    limit: any;
    setLimit: any;
}

const ChatContextProvider: FC<Props> = ({ children }) => {
    const [messages, setMessages, clearMessages] = useMessageCollection();
    const [limit, setLimit] = useState(-1);

    return (
        <ChatContext.Provider
            value={{ messages, setMessages, clearMessages, limit, setLimit }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const ChatContext = createContext<IChatContext | null>(null);

export { ChatContext, ChatContextProvider };

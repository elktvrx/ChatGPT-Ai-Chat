import React, { FC } from 'react';
import { MdComputer } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import remarkGfm from 'remark-gfm';
import moment from 'moment';
import Image from './Image';

type Props = {
    message: any;
};

const ChatMessage: FC<Props> = (props) => {
    const { id, createdAt, text, ai = false, selected, picUrl } = props.message;
    console.log(picUrl);

    return (
        <div key={id} className={`${ai && 'flex-row-reverse'} message`}>
            {selected === 'DALL·E' && ai ? (
                <Image url={text} />
            ) : (
                <div className="message__wrapper">
                    <ReactMarkdown
                        className={`message__markdown ${
                            ai ? 'text-left' : 'text-right'
                        }`}
                        // eslint-disable-next-line react/no-children-prop
                        children={text}
                        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                        components={{
                            code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                            }: CodeProps) {
                                const match = /language-(\w+)/.exec(
                                    className || 'language-js'
                                );
                                return !inline && match ? (
                                    <Prism
                                        // eslint-disable-next-line react/no-children-prop
                                        children={String(children).replace(
                                            /\n$/,
                                            ''
                                        )}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                        style={atomDark}
                                    />
                                ) : (
                                    <code className={className} {...props}>
                                        {children}{' '}
                                    </code>
                                );
                            },
                        }}
                    />

                    <div
                        className={`${
                            ai ? 'text-left' : 'text-right'
                        } message__createdAt`}
                    >
                        {moment(createdAt).calendar()}
                    </div>
                </div>
            )}

            <div className="message__pic">
                {ai ? (
                    <MdComputer />
                ) : (
                    <img
                        className="cover w-10 h-10 rounded-full"
                        loading="lazy"
                        src={picUrl}
                        alt="profile pic"
                    />
                )}
            </div>
        </div>
    );
};

export default ChatMessage;

import React, { useState, useContext, useEffect, FC } from 'react';
import { MdClose, MdMenu, MdAdd, MdOutlineLogout } from 'react-icons/md';
import { ChatContext, IChatContext } from '../context/chatContext';
import bot from '../assets/images/bot.ico';
import DarkMode from './DarkMode';
import { auth } from '../firebase';

const SideBar: FC = () => {
    const [open, setOpen] = useState(true);
    const { clearMessages, limit, setLimit } = useContext(
        ChatContext
    ) as IChatContext;

    function handleResize() {
        window.innerWidth <= 640 ? setOpen(false) : setOpen(true);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const clearChat = () => clearMessages();
    const SignOut = () => {
        if (auth.currentUser) {
            auth.signOut();
            clearChat();
            setLimit(-1);
            window.sessionStorage.clear();
        }
    };

    return (
        <section className={` ${open ? 'w-72' : 'w-16'} sidebar`}>
            <div className="sidebar__app-bar">
                <div
                    className={`sidebar__app-logo ${
                        !open && 'scale-0 hidden'
                    } `}
                >
                    <span className="w-8 h-8">
                        <img src={bot} alt="" />
                    </span>
                </div>
                <h1
                    className={`sidebar__app-title ${
                        !open && 'scale-0 hidden'
                    }`}
                >
                    GPT3-Chatbot
                </h1>
                <div
                    className="sidebar__btn-close"
                    onClick={() => setOpen(!open)}
                >
                    {open ? (
                        <MdClose className="sidebar__btn-icon" />
                    ) : (
                        <MdMenu className="sidebar__btn-icon" />
                    )}
                </div>
            </div>
            <div className="nav">
                <span className="nav__item  bg-light-white" onClick={clearChat}>
                    <div className="nav__icons">
                        <MdAdd />
                    </div>
                    <h1 className={`${!open && 'hidden'}`}>New chat</h1>
                </span>
            </div>
            {limit >= 0 && (
                <div className={`nav__msg ${!open && 'scale-0 hidden'}`}>
                    <p className="nav__p">
                        you have {limit} requests left today.
                    </p>
                </div>
            )}

            <div className="nav__bottom">
                <DarkMode open={open} />
                <div className="nav">
                    <span className="nav__item" onClick={SignOut}>
                        <div className="nav__icons">
                            <MdOutlineLogout />
                        </div>
                        <h1 className={`${!open && 'hidden'}`}>Log out</h1>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default SideBar;

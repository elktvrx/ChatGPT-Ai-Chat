import React, { FC } from 'react';
import useDarkMode from '../hooks/useDarkMode';
import { MdOutlineNightlight, MdOutlineWbSunny } from 'react-icons/md';

type Props = {
    open: boolean;
};

const DarkMode: FC<Props> = (props) => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);

    return (
        <div className="nav">
            <span className="nav__item" onClick={handleMode}>
                {darkTheme ? (
                    <>
                        <div className="nav__icons">
                            <MdOutlineWbSunny />
                        </div>
                        <h1 className={`${!props.open && 'hidden'}`}>
                            Light mode
                        </h1>
                    </>
                ) : (
                    <>
                        <div className="nav__icons">
                            <MdOutlineNightlight />
                        </div>
                        <h1 className={`${!props.open && 'hidden'}`}>
                            Night mode
                        </h1>
                    </>
                )}
            </span>
        </div>
    );
};

export default DarkMode;

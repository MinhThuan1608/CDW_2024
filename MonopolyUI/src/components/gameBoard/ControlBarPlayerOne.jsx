import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../contexts/Context';


const ControlBarPlayerOne = () => {
    const { appState, dispatch } = useAppContext();
    const [seconds, setSeconds] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [appState.turn]);


    return (
        <div className="control-game control-game-one">

            <p className="turn-player">
                Turn
                <span className='turn'> {appState.turn === 'b' ? 'Black' : 'White'}</span>
            </p>

            <div className="countdown-timer">
                00: <span id="timer">{seconds}</span>
            </div>
        </div>
    )

}
export default ControlBarPlayerOne;
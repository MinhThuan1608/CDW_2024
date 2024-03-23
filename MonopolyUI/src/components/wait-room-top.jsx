import { React, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faBars, faXmark, faGear, faCoins, faEyeSlash, faEye, faCopy } from '@fortawesome/free-solid-svg-icons';


const WaitRoom = () => {
    const [password, setPassword] = useState('aghteyyi');
    const [showPassword, setShowPassword] = useState(false);
  
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };
    const handleCopyPassword = () => {
      
      alert('Đã sao chép');
    };
    return (
        <div className='top-part'>
            <div className="top-part-one">
                <div className="score-and-money">
                    <p className="top-name-user">Thuỳ win</p>
                    <div className="img-frame">
                    </div>
                    <p className="coins">
                        <span>999900</span>
                        <FontAwesomeIcon icon={faCoins} className="money-icon" />
                    </p>
                    <p className="coins">
                        <span>9999</span>
                        <FontAwesomeIcon icon={faCoins} className="money-icon" />
                    </p>

                </div>
                <div className="lable-room">
                    <p>private table</p>
                </div>
                <div className="web-options">
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faCartPlus} className="setting-icon" />
                    </div>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faBars} className="setting-icon" />
                    </div>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faGear} className="setting-icon" />
                    </div>
                    <div className="icon-container icon-container-exit">
                        <FontAwesomeIcon icon={faXmark} className="setting-icon" />
                    </div>
                </div>
            </div>
            <div className='top-part-two'>
                <div className='password-div'>
                    <FontAwesomeIcon  icon={!showPassword ? faEyeSlash : faEye} onClick={handleTogglePassword} className="setting-icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        disabled
                        value={password}
                        placeholder='********'
                    />
                    <FontAwesomeIcon icon={faCopy} onClick={handleCopyPassword} className="setting-icon" />
                </div>
                <div className='options-div'>
                    <button className="options-btn btn-primary">2x2</button>
                    <button className="options-btn">quick game</button>
                    <button className="options-btn">no sussgest</button>
                </div>
            </div>

        </div>
    );
}
export default WaitRoom;
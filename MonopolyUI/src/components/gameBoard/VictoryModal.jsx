import { useAppContext } from '../../contexts/Context';
import { faChess } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import WinCup from '../../assert/images/icon/win-cup.jpg'

const VictoryModal = (props) => {
    const createFirework = () => {
        const firework = document.createElement('div');
        firework.classList.add('firework');
    
        const xPos = Math.random() * window.innerWidth;
        const yPos = Math.random() * window.innerHeight;
    
        firework.style.left = xPos + 'px';
        firework.style.top = yPos + 'px';
    
        document.body.appendChild(firework);
    
        setTimeout(() => {
            firework.remove();
        }, 3000);
    }
    
    const startFireworks = () => {
        // Tạo 20 pháo hoa giấy
        for (let i = 0; i < 200; i++) {
            setTimeout(createFirework, i * 100);
        }
    }
    useEffect(() => {
        startFireworks()
    }, [])
    
    return <div className='victory'>
        <div className="victory-modal">
        <div className='tilte-win'>
            <span>Quân </span>
            <FontAwesomeIcon icon={faChess} className={`${props.listUsers[0].id === props.isUserWin ? 'icon-chess-white' : ''} icon-chess-game`} /> 
            <p> {props.listUsers[0].id === props.isUserWin ? props.listUsers[0].username : props.listUsers[1].username} thắng</p>
            {/* <span> thắng</span> */}
        </div>
        {/* <div className="victory-img" style={{ backgroundImage: `url(${props.listUsers[0].id === props.isUserWin ? props.listUsers[0].avatar.data : props.listUsers[1].avatar.data})` }}></div> */}
        <div className="victory-img" style={{ backgroundImage: `url(${WinCup})` }}></div>
        <div className='btn-control'>
            {/* <button className='btn-out' onClick={handleBtnExit}>Thoát</button> */}
            {/* <button className='btn-yes' onClick={handleBtnExit}>OK</button> */}
        </div>
    </div>
    </div>

}
export default VictoryModal;
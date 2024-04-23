import { useAppContext } from '../../contexts/Context';
import './Popup/Popup.css'
import userAvt from '../../assert/images/avatar/meo.jpg';
import { faChess } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VictoryModal = (props) => {
    const handleBtnExit = () => {
        window.location = '/wait-room/'+props.roomId
    }

    return <div className="victory-modal">
        <div className='tilte-win'>
            <span className='white-color'>Quân </span>
            <FontAwesomeIcon icon={faChess} className={`${props.listUsers[0].id === props.isUserWin ? 'icon-chess-white-win' : 'icon-chess-dark'} icon-chess-game`} /> 
            <span className='white-color'> thắng</span>
            
        </div>
        <div className="victory-img" style={{ backgroundImage: `url(${props.listUsers[0].id === props.isUserWin ? props.listUsers[0].avatar.data : props.listUsers[1].avatar.data})` }}></div>
        <div className='btn-control'>
            {/* <button className='btn-out' onClick={handleBtnExit}>Thoát</button> */}
            <button className='btn-yes' onClick={handleBtnExit}>OK</button>
        </div>
    </div>

}
export default VictoryModal;
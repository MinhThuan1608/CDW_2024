import { useAppContext } from '../../contexts/Context';
import './Popup/Popup.css'
import userAvt from '../../assert/images/avatar/meo.jpg';
import { faChess } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VictoryModal = (props) => {
    const { appState } = useAppContext()
    const handleBtnExit = () => {
        window.location = '/'
    }

    return <div className="victory-modal">
        <div className='tilte-win'>Quân Thắng
            {/* <FontAwesomeIcon icon={faChess} className={`icon-chess-game ${!props.listUsers[0] ? 'icon-chess-white' : ''}`} /> */}
        </div>
        <div className="victory-img" style={{ backgroundImage: `url(${!props.listUsers[0] ? userAvt : props.listUsers[0].avatar ? props.listUsers[0].avatar.data : userAvt})` }}></div>
        <div className='btn-control'>
            <button className='btn-out' onClick={handleBtnExit}>Thoát</button>
            <button className='btn-yes' onClick={handleBtnExit}>OK</button>
        </div>
    </div>

}
export default VictoryModal;
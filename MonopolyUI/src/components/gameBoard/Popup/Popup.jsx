import { useAppContext } from '../../../contexts/Context';
import './Popup.css'
import PromotionBox from './PromotionBox/PromotionBox';

const Popup = (props) => {
    const{appState} = useAppContext()
    const handleUpdatePawn = () => {
        props.setCompletePromotionChoose(true)
        appState.isPromotion = false;
    }
    return <div className="popup">
        <p className='tilte-update'>Nâng cấp con Tốt của bạn</p>
        <PromotionBox isSelected = {props.isSelected} setIsSelected= {props.setIsSelected}/>
        <button className='btnOK' onClick={handleUpdatePawn}>OK</button>
    </div>

}
export default Popup;
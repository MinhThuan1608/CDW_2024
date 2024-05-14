import { useEffect , useState} from 'react';
import { useAppContext } from '../../../contexts/Context';
import './Popup.css'
import PromotionBox from './PromotionBox/PromotionBox';

const Popup = (props) => {
    const { appState } = useAppContext()
    const handleUpdatePawn = () => {
        props.setCompletePromotionChoose(true)
        appState.isPromotion = false;
    }
    useEffect(() => {
        if(props.seconds < 1) handleUpdatePawn()
    }, [props.seconds]);

    return <div className="popup">
        <p className='tilte-update'>Nâng cấp quân Tốt của bạn</p>
        <p className='tilte-update'>Tự động nâng cấp thành quân Hậu sau {props.seconds}s</p>
        <PromotionBox isSelected={props.isSelected} setIsSelected={props.setIsSelected} />
        <button className='btnOK' onClick={handleUpdatePawn}>OK</button>
    </div>

}
export default Popup;
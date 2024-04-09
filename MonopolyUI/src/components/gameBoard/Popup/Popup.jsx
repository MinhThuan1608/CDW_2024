import './Popup.css'
import PromotionBox from './PromotionBox/PromotionBox';

const Popup = () => {
    return <div className="popup">
        <p className='tilte-update'>Nâng cấp con Tốt của bạn</p>
        <PromotionBox/>
        <button className='btnOK'>OK</button>
    </div>

}
export default Popup;
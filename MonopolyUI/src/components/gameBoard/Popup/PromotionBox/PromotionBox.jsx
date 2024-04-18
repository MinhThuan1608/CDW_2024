import { useState } from 'react'
import { useAppContext } from '../../../../contexts/Context'
import './PromotionBox.css'

const PromotionBox = (props) => {
    const{appState} = useAppContext()
    const options = ['q', 'r', 'b', 'n']
    const color = appState.turn
    

    return <div className='popup-inner promotion-choices'>
        {options.map((op, index) =>
            <div key={index} className={`piece ${color}${op} ${op === props.isSelected ? 'active' : ''}`} onClick={() => props.setIsSelected(op)}></div>
        )}
    </div>

}
export default PromotionBox;
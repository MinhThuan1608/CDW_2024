import './PromotionBox.css'

const PromotionBox = () => {
    const options = ['q', 'r', 'b', 'n']
    const color = 'b'

    const x = 0
    const y = 6

    const getPromotionBoxPosition = () => {
        const style = {}
        if (x === 7)
            style.top = '-8.5%'
        else
            style.top = '93.5%'

        if (y <= 1)
            style.left = '0%'
        else if(y >= 6)
            style.right = '0%'
        else
        style.right = `${12.5 * y - 20}%`
        return style
        
    }
    return <div className='d-none popup-inner promotion-choices' style={getPromotionBoxPosition()}>
        {options.map((op, index) =>
            <div key={index} className={`piece ${color}${op}`}></div>
        )}
    </div>

}
export default PromotionBox;
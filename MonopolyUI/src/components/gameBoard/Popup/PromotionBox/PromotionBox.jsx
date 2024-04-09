import './PromotionBox.css'

const PromotionBox = () => {
    const options = ['q', 'r', 'b', 'n']
    const color = 'b'

    // const x = 7
    // const y = 6

    // const getPromotionBoxPosition = () => {
    //     const style = {}
    //     if (x === 7)
    //         style.top = '0%'
    //     else
    //         style.top = '93.5%'

    //     if (y <= 1)
    //         style.left = '0%'
    //     else if(y >= 6)
    //         style.right = '0%'
    //     else
    //     style.right = `${12.5 * y - 20}%`
    //     return style
        
    // }
    return <div className='popup-inner promotion-choices'>
        {options.map((op, index) =>
            <div key={index} className={`piece ${color}${op}`}></div>
        )}
    </div>

}
export default PromotionBox;
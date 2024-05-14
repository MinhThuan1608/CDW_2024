import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from '../../assert/style/setting-modal.module.css'


const SettingModal = (props) => {

    const [tabSelected, setTabSelected] = useState(1)
    const [generalVolume, setGeneralVolume] = useState(Number(localStorage.getItem('generalVolume')) ?? 80)
    const [backgroundVolume, setBackgroundVolume] = useState(Number(localStorage.getItem('backgroundVolume')) ?? 100)
    const [effectVolume, setEffectVolume] = useState(Number(localStorage.getItem('effectVolume')) ?? 100)

    const handleCloseModal = () => {
        props.setShowModalSetting(false);
    };

    const handleChangeGeneralVolume = (e) => {
        setGeneralVolume(e.target.value)
        localStorage.setItem('generalVolume', e.target.value)
    }

    return (
        <div className="modal show" style={{ display: 'block', position: 'initial', height: 'auto' }} >

            <Modal.Dialog>
                <Modal.Header className={Styles.modalHeader}>
                    <div className={Styles.tabsContainer}>
                        <p className={`${Styles.tabsButton} ${tabSelected === 1 ? Styles.active : ''}`} onClick={() => setTabSelected(1)}>Âm thanh</p>
                    </div>
                    <button type="button" className={`btn-close ${Styles.btnClose}`} data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                </Modal.Header>

                <Modal.Body className={Styles.modalBody}>
                    {tabSelected === 1 && (
                        <div className={Styles.soundSettingContainer}>
                            <div className={`${Styles.column} ${Styles.columnLeft}`}>
                                <div className={Styles.row}>Âm lượng: </div>
                            </div>
                            <div className={`${Styles.column} ${Styles.columnRight}`}>
                                <div className={Styles.row}>
                                    <input type="range" className={Styles.rangeInput} name="general-volume" id="" value={generalVolume} min={0} max={100} onChange={handleChangeGeneralVolume} />
                                </div>
                            </div>
                        </div>
                    )}

                </Modal.Body>

            </Modal.Dialog>


        </div>
    );
}
export default SettingModal;
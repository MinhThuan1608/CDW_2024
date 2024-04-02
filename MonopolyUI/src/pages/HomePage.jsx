import React from 'react';
import '../assert/style/home.css';
import HomeTop from '../components/homePackage/home-top';
import HomeMiddle from '../components/homePackage/home-middle';
import HomeBottom from '../components/homePackage/home-bottom';
import { useState } from 'react';


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [showModalBag, setShowModalBag] = useState(false);

  return (
    <div className='main-container'>
      <HomeTop />
      <HomeMiddle
        showModal={showModal} setShowModal={setShowModal}
        showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}
        showModalBag={showModalBag}
        setShowModalBag={setShowModalBag} />
      <HomeBottom showModal={showModal} setShowModal={setShowModal}
        showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}
        showModalBag={showModalBag}
        setShowModalBag={setShowModalBag} />
    </div>
  );
}
export default HomePage;
import React, { useContext, useEffect } from 'react';
import '../assert/style/home.css';
import HomeTop from '../components/homePackage/home-top';
import HomeMiddle from '../components/homePackage/home-middle';
import HomeBottom from '../components/homePackage/home-bottom';
import { useState } from 'react';
import { SocketContext } from '../App';
import Swal from 'sweetalert2';
import { JoinRoom } from '../api_caller/room';


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [showModalBag, setShowModalBag] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [showModalShop, setShowModalShop] = useState(false);

  const { socket } = useContext(SocketContext)
  const me = JSON.parse(sessionStorage.getItem('user'))

  useEffect(() => {
    if (socket) {
      socket.subscribe(`/user/${me.id}/topic/room/invite`, (message) => {
        const inviteMessage = JSON.parse(message.body)
        console.log("private invite")
        console.log(inviteMessage)
        switch (inviteMessage.inviteMessageType) {
          case "INVITE":
            Swal.fire({
              title: "Lời mời",
              html: "Bạn nhận được lời mời vào phòng từ <b>" + inviteMessage.sender?.username + "</b>",
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: "Vào phòng",
              denyButtonText: 'Từ chối',
              cancelButtonText: 'Trở lại',
              reverseButtons: true,
              imageUrl: inviteMessage.sender?.avatar?.data,
              imageWidth: 200,
              imageHeight: 200,
              imageAlt: "Avatar"
            }).then((result) => {
              if (result.isConfirmed) {
                JoinRoom(inviteMessage.roomId, inviteMessage.roomPass).then(result => {
                  if (result) {
                    window.location = `/wait-room/${inviteMessage.roomId}`
                  } else Swal.fire("Có lỗi xảy ra!", "Thông cảm xíu nhaaa", "error");
                })
              } else if (result.isDenied) {
                socket.publish({
                  destination: '/app/room/invite',
                  body: JSON.stringify({
                    receiverId: inviteMessage.sender.id,
                    inviteMessageType: "DECLINE",
                  })
                });
              }
            });
            break
          default:
            break
        }
      });
    }
  }, [socket])

  return (
    <div className='home-container'>
      <HomeTop
        showModal={showModal}
        showModalCreateRoom={showModalCreateRoom}
        showModalBag={showModalBag}
        showModalProfile={showModalProfile} setShowModalProfile={setShowModalProfile} />
      <HomeMiddle
        showModal={showModal} setShowModal={setShowModal}
        showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}
        showModalBag={showModalBag} setShowModalBag={setShowModalBag}
        showModalProfile={showModalProfile} setShowModalProfile={setShowModalProfile}
        showModalShop={showModalShop} setShowModalShop={setShowModalShop} />
      <HomeBottom
        showModal={showModal} setShowModal={setShowModal}
        showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}
        showModalBag={showModalBag} setShowModalBag={setShowModalBag}
        showModalShop={showModalShop} setShowModalShop={setShowModalShop}
      />
    </div>
  );
}
export default HomePage;
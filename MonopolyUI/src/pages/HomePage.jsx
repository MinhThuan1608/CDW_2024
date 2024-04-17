import React, { useContext, useEffect } from 'react';
import '../assert/style/home.css';
import HomeTop from '../components/homePackage/home-top';
import HomeMiddle from '../components/homePackage/home-middle';
import HomeBottom from '../components/homePackage/home-bottom';
import { useState } from 'react';
import { SocketContext } from '../App';
import Swal from 'sweetalert2';
import { GetRoomMeIn, JoinRoom } from '../api_caller/room';
import { GetMe } from '../api_caller/user';


const HomePage = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [showModalBag, setShowModalBag] = useState(false);
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if (socket && props.me.id) {
      console.log(`/user/${props.me.id}/topic/room/invite`)
      socket.subscribe(`/user/${props.me.id}/topic/room/invite`, (message) => {
        const inviteMessage = JSON.parse(message.body)
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
  }, [socket, props.me])

  return (
    <div className='main-container'>
      <HomeTop me={props.me}/>
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
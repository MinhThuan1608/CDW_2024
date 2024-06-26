import React, { useContext, useEffect } from 'react';
import '../assert/style/home.css';
import HomeTop from '../components/homePackage/home-top';
import HomeMiddle from '../components/homePackage/home-middle';
import HomeBottom from '../components/homePackage/home-bottom';
import { useState } from 'react';
import { SocketContext } from '../App';
import Swal from 'sweetalert2';
import { GetRoomMeIn, JoinRoom } from '../api_caller/room';
import { GetBag, GetFriendRequest, GetMe } from '../api_caller/user';
import { toast } from 'react-toastify';


const HomePage = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [showModalBag, setShowModalBag] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [showModalShop, setShowModalShop] = useState(false);
  const [showModalFriend, setShowModalFriend] = useState(false);
  const [showModalSetting, setShowModalSetting] = useState(false);
  const [friendRequests, setFriendRequests] = useState([])
  const [listItem, setListItem] = useState([]);

  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if (socket && props.me.id) {
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
                  if (result === 200) {
                    window.location = `/wait-room/${inviteMessage.roomId}`
                  } else if (result === 405) {
                    toast.warn('Bạn chưa xác thực mail nên không thể tham gia!')
                    socket.publish({
                      destination: '/app/room/invite',
                      body: JSON.stringify({
                        receiverId: inviteMessage.sender.id,
                        inviteMessageType: "NOT_CONFIRM_MAIL",
                      })
                    });
                  } else {
                    toast.error('Có lỗi xảy ra, thông cảm xíu nhaa!')
                  }
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


  useEffect(() => {
    if (props.me.id) {
    GetFriendRequest().then(res => setFriendRequests(res))
    GetBag(props.me?.id).then(res => setListItem(res))
    }
  }, [props.me.id, props.me.money, props.me.username, showModalBag])

  return (
    <div className='home-container'>
      <HomeTop
        me={props.me}
        setMe={props.setMe}
        showModal={showModal}
        showModalCreateRoom={showModalCreateRoom}
        showModalBag={showModalBag}
        showModalProfile={showModalProfile} setShowModalProfile={setShowModalProfile}
        friendRequests={friendRequests} showModalFriend={showModalFriend} setShowModalFriend={setShowModalFriend}
        showModalSetting={showModalSetting} setShowModalSetting={setShowModalSetting} />
      <HomeMiddle
        me={props.me}
        setMe={props.setMe}
        showModal={showModal} setShowModal={setShowModal}
        showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}
        showModalBag={showModalBag} setShowModalBag={setShowModalBag}
        showModalProfile={showModalProfile} setShowModalProfile={setShowModalProfile}
        showModalShop={showModalShop} setShowModalShop={setShowModalShop}
        showModalFriend={showModalFriend} setShowModalFriend={setShowModalFriend}
        friendRequests={friendRequests} setFriendRequests={setFriendRequests}
        showModalSetting={showModalSetting} setShowModalSetting={setShowModalSetting}
        listItem={listItem} setListItem={setListItem} />
      <HomeBottom
        showModal={showModal} setShowModal={setShowModal}
        showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}
        showModalBag={showModalBag} setShowModalBag={setShowModalBag}
        showModalShop={showModalShop} setShowModalShop={setShowModalShop}
        friendRequests={friendRequests} setShowModalFriend={setShowModalFriend}
        showModalFriend={showModalFriend} socket={socket} me={props.me}
        listItem={listItem} setListItem={setListItem}
        showModalSetting={showModalSetting} setShowModalSetting={setShowModalSetting} />
    </div>
  );
}
export default HomePage;
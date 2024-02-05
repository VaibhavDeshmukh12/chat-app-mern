/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import { allUsersRoute ,host} from '../utils/ApiRoutes';
import axios from 'axios';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from 'socket.io-client';

const Chat = () => {

    const socket = useRef();
    const navigate = useNavigate();
    const [contacts,setContacts] = useState([]);
    const [currentUser,setCurrentUser] = useState(undefined);
    const [currentChat,setCurrentChat] = useState(undefined);

    const get = async()=>{
        if (!localStorage.getItem('chat-app-user'))
			navigate("/login");
        else{
            setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        }
    }
    useEffect(()=>{ get()},[])

    useEffect(()=>{
        if(currentUser){
            socket.current = io(host);
            socket.current.emit('add-user',currentUser._id);
        }
    },[currentUser]);

    const getData = async()=>{
        if(currentUser){
            if(currentUser.isAvatarImageSet){
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            }
            else{
                navigate('/setAvatar');
            }
        }
    }
    useEffect(()=>{getData()},[getData])

    const handleChatChange = (chat)=>{
        setCurrentChat(chat);
    }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} currentUser={currentUser} ></Contacts>
        {
            currentChat === undefined ?
            <Welcome currentUser={currentUser} />
            : <ChatContainer socket={socket} currentUser={currentUser} currentChat={currentChat} />
        }
      </div>
    </Container>
  )
}


const Container = styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction: column;
    justify-content:center;
    gap:1rem;
    align-items:center;
    background-color:#131324;
    .container{
        height:85vh;
        width:85vw;
        background-color:#00000076;
        display:grid;
        grid-template-columns:25% 75%;
        @media screen and (min-width:720px) and (max-width:1080px){
            grid-template-columns:35% 65%;
        }
    }
`;

export default Chat

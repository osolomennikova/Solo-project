import React from 'react';
import {useState, useEffect} from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({socket, username, room}) {

    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                username: username,
                room: room,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_message', messageData);
            setMessages((messages) => [...messages, messageData]);
            setCurrentMessage('');
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((messages) => [...messages, data]);
        });
    }, [socket]);


    return (
        <div>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom>
                {messages.map((message, index) => {
                    return (
                        <div id={username === message.username ? "you" : "other"} key={index}>
                            <div>
                                <p>{message.message}</p>
                            </div>
                            <div>
                                <p>{message.time} </p>
                                <p>{message.username}</p>
                            </div>
                        </div>
                    )
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input value={currentMessage} onChange={(e) => {
                    setCurrentMessage(e.target.value)
                }} onKeyDown={(e) => {e.key === 'Enter' && sendMessage()}} type="text" placeholder="Hi!.."
                       className="border-pink-200 outline-pink-500 focus:border-pink-500 border-2 p-3 my-4 rounded text-pink-500"/>
                <button onClick={sendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Chat;

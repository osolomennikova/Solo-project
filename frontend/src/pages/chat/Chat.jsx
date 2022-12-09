import React from 'react';
import {useState, useEffect} from "react";
import ScrollToBottom,  {useScrollToBottom} from "react-scroll-to-bottom";
import { css } from '@emotion/css';
import io from "socket.io-client";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ROOT_CSS = css({
    height: window.innerHeight - 160,
});

function Chat({chatID}) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const scrollToBottom = useScrollToBottom();
    const userName = localStorage.getItem('userName') || "";
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!chatID) return;
        const socket = io('http://localhost:3100');
        socket.emit('join_contact', {chatID});
        setSocket(socket);
        return () => {
            socket.close();
        }
    }, [chatID]);

    const sendMessage = async () => {
        scrollToBottom();
        if (currentMessage !== "") {
            const messageData = {
                chatID,
                userName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_message', messageData);
            setMessages((messages) => [...messages, messageData]);
            setCurrentMessage('');
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (data) => {
                setMessages((messages) => [...messages, data]);
            })
        }
    }, [socket]);

    if (!chatID) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <h1 className="text-2xl text-gray-500">Please select a chat</h1>
            </div>
        )
    }

    return (
        <div className="">
            <div className="p-4 border-b border-b-gray-400">
                <p>Live Chat with {""}</p>
            </div>
            <div className="">
                <ScrollToBottom className={ROOT_CSS}>
                    {messages.map((message, index) => {
                        return (
                            <div
                                    className={
                                        classNames(
                                            userName === message.userName ? "text-right " : "text-left",
                                            "w-full"
                                        )}
                                key={index}>
                                <span
                                    className={
                                        classNames(
                                            userName === message.userName ? " bg-amber-300" : "bg-violet-400",
                                            "max-w-lg inline-block rounded-lg p-2 m-2"
                                        )}
                                >
                                    <span>{message.message}</span>
                                    <span>{message.time} </span>
                                    <span>{message.username}</span>
                                </span>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className="px-4">
                <input value={currentMessage} onChange={(e) => {
                    setCurrentMessage(e.target.value)
                }} onKeyDown={(e) => {
                    e.key === 'Enter' && sendMessage()
                }} type="text" placeholder="Hi!.."
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

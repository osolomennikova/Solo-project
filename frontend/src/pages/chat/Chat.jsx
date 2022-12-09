import React from 'react';
import {useState, useEffect} from "react";
import ScrollToBottom,  {useScrollToBottom} from "react-scroll-to-bottom";
import { css } from '@emotion/css';
import io from "socket.io-client";
import InputEmoji from 'react-input-emoji';

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
    const [chatName, setChatName] = useState("");
    const [ourId, setOurId] = useState("");

    useEffect(() => {
        if (!chatID) return;
        const socket = io('http://localhost:3100');
        socket.emit('join_contact', {chatID});
        setSocket(socket);
        return () => {
            socket.close();
        }
    }, [chatID]);

    useEffect(() => {
        fetch(`/chats/${chatID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error(res.statusText);
            }
        }).then((data) => {
            setMessages(data.messages);
            setChatName(data.chat_name);
            setOurId(data.our_id);
        })

        // {messages:[], chat_name: "Main public"}
    }, [chatID]);

    const sendMessage = async () => {
        scrollToBottom();
        if (currentMessage !== "") {
            const messageData = {
                chatID,
                user_id: ourId,
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
            <div className="grid content-center w-full h-screen">
                <h1 className="text-2xl text-gray-500 text-center">Please select a chat or search new contacts ...</h1>
            </div>
        )
    }

    return (
        <div className="">
            <div className="p-4 border-b border-b-gray-400">
                <img
                    className="h-6 w-6 flex-shrink-0 rounded-full bg-gray-300 inline"
                    src={`https://avatars.dicebear.com/api/bottts/${chatName}.svg`}
                    alt=""
                />
                <span className="ml-2 font-bold text-violet-800">{chatName}</span>
            </div>
            <div className="">
                <ScrollToBottom className={ROOT_CSS}>
                    {messages.map((message, index) => {
                        return (
                            <div
                                    className={
                                        classNames(
                                            ourId === message.user_id ? "text-right " : "text-left",
                                            "w-full"
                                        )}
                                key={index}>
                                <span
                                    className={
                                        classNames(
                                            ourId === message.user_id ? "bg-amber-200" : "bg-violet-200",
                                            "max-w-lg inline-block rounded-lg p-3 m-4"
                                        )}
                                >
                                    <span className="font-sans text-base">{message.message}</span>
                                    <span className=" block font-serif text-xs text-slate-500">{message.time} </span>
                                    <span className="">{message.username}</span>
                                </span>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className="px-4 flex justify-between">
                <InputEmoji
                    value={currentMessage}
                    onChange={setCurrentMessage}
                    cleanOnEnter
                    onEnter={sendMessage}
                    placeholder="Type a message"
                />
            </div>
        </div>
    );
}

export default Chat;

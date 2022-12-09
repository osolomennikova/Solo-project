import React, {useState, useEffect} from 'react';

function Contacts({handleOpenChat}) {

    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetch('/chats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then(data => {
                setChats(data.chats)
            })
    }, []);


    return (
        <div className="mt-8">
            <h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-contacts-headline">
                Contacts
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-contacts-headline">
                {chats && chats.map((chat) => (
                    <ContactItem chat={chat} handleOpenChat={handleOpenChat}/>
                ))}
            </div>
        </div>
    );
}

function ContactItem({chat, handleOpenChat}) {
    return (
        <span
            key={chat.id}
            onClick={() => {
                handleOpenChat(chat.id);
            }}
            className="cursor-pointer group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
                      <span
                          className='w-2.5 h-2.5 mr-4 rounded-full bg-green-500'
                          aria-hidden="true"
                      />
            <span className="truncate">{chat.chat_name}</span>
        </span>
    );
}

export default Contacts;

import React, {useState, useEffect} from 'react';

function Contacts({handleOpenChat}) {

    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetch('/groups', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return {rooms: []};
            }

        }).then(data => {
            setChats(data.rooms)
        })
    }, []);

    const handleOpenGroupChat = (id, name) => {
        fetch('/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                room_id: id,
                room_name: name,
            })
        }).then((resp) => {
            if (resp.status === 200) {
                return resp.json();
            } else {
                throw new Error('Error');
            }
        }).then((data) => {
            handleOpenChat(data.id);
        })
    }


    return (
        <div className="mt-8">
            <h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-contacts-headline">
                Chats
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-contacts-headline">
                {chats && chats.map((chat) => (
                    <ContactItem chat={chat} handleOpenGroupChat={handleOpenGroupChat}/>
                ))}
            </div>
        </div>
    );
}

function ContactItem({chat, handleOpenGroupChat}) {
    return (
        <span
            key={chat.id}
            onClick={() => {
                handleOpenGroupChat(chat.id, chat.room_name);
            }}
            className="cursor-pointer group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
                      <span
                          className='w-2.5 h-2.5 mr-4 rounded-full bg-green-500'
                          aria-hidden="true"
                      />
            <span className="truncate">{chat.room_name}</span>
        </span>
    );
}

export default Contacts;

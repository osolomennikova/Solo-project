import React from 'react';

const chats = [
    {name: 'Main public', id: 1},
]

function Chats() {
    return (
        <div className="mt-8">
            <h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-contacts-headline">
                Chats
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-contacts-headline">
                {chats.map((chat) => (
                    <ChatItem chat={chat}/>
                ))}
            </div>
        </div>
    );
}

function ChatItem({chat}) {
    return (
        <span
            key={chat.name}
            onClick={() => {
                console.log(chat.id, chat.name)
            }}
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
                      <span
                          className='w-2.5 h-2.5 mr-4 rounded-full bg-pink-500'
                          aria-hidden="true"
                      />
            <span className="truncate">{chat.name}</span>
        </span>
    );
}

export default Chats;

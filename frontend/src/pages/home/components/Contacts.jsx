import React, {useState, useEffect} from 'react';

function Contacts() {
    // state with contacts as array, default value is empty array
    const [contacts, setContacts] = useState([]);
    // useEffect to fetch contacts from API
    useEffect(() => {
        // fetch contacts from API
        // .then(
        // setState contacts
        // )
        fetch('/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then(data => {
                setContacts(data.users)
            })
    }, []);


    return (
        <div className="mt-8">
            <h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-contacts-headline">
                Contacts
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-contacts-headline">
                {contacts && contacts.map((contact) => (
                    <ContactItem contact={contact}/>
                ))}
            </div>
        </div>
    );
}

function ContactItem({contact}) {
    return (
        <span
            key={contact.id}
            onClick={() => {
                console.log(contact.id, contact.userName)
            }}
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
                      <span
                          className='w-2.5 h-2.5 mr-4 rounded-full bg-green-500'
                          aria-hidden="true"
                      />
            <span className="truncate">{contact.userName}</span>
        </span>
    );
}

export default Contacts;

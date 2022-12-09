import React from 'react';
import AsyncSelect from 'react-select/async';

function Search({handleOpenChat}) {

    const promiseOptions = (inputValue) =>
        new Promise((resolve, reject) => {
            fetch(`/search/users?query=${inputValue}`)
                .then((response) => response.json())
                .then((json) => {
                    resolve(json.users);

                })
                .catch((error) => {
                    reject(error);
                });
        });

    return (
        <div className="p-2 w-full">
            <AsyncSelect
                value={null}
                loadOptions={promiseOptions}
                placeholder={'Поиск ...'}
                getOptionLabel={(option) => option.userName}
                getOptionValue={(option) => option.id}
                onChange={(option) => {
                    fetch(`/chats`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',

                        },
                        body: JSON.stringify({
                            userId: option.id,
                        })
                    })
                        .then((response) => response.json())
                        .then((json) => {
                            handleOpenChat(json.id);
                        })
                }}
                isClearable
            />
        </div>
    );
}

export default Search;

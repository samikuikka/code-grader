import React, { useState } from 'react';

const Form = ({id}) => {
    const [code, setCode] = useState('');
    const user = localStorage.getItem('exercise-user')

    const handleSubmit = (event) => {
        event.preventDefault();
        const body = {
            code: code,
            name: id,
            user: user 
        }
        console.log('Sending ', body)

        fetch('http://localhost:7777/', {
            method: "POST",
            body: JSON.stringify(body)
        },)    
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            ></textarea><br/>
            <input
                type="submit"
                className='p-3 bg-blue-400 hover:bg-blue-500'
                />
        </form>
    )
}

export default Form;
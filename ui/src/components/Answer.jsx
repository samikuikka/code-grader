import { useState, useEffect } from "react";
import { v4 } from 'uuid'

const Answer = ({id}) => {
    const [answer, setAnswer] = useState("");
    const [code, setCode] = useState('');

    useEffect(() => {
        console.log('Attempting to connect to the websocket');
        let user_id = localStorage.getItem('exercise-user');
        if(!user_id) {
            console.log('creating new user!')
            const new_id = v4();
            localStorage.setItem('exercise-user', new_id);
            user_id = new_id;
        }

        const ws = new WebSocket(`ws://localhost:7775/connect?id=${user_id}`)

        ws.onopen = () => console.log('Connection established');
        ws.onerror = (e) => console.log('Web socket error:', e);

        ws.onmessage = (event) => {
            const obj = JSON.parse(event.data);
            console.log('Result:', obj);
            if(obj.exercise == id) {
                if(obj.result) {
                    setAnswer("SUCCESS");
                } else {
                    setAnswer("FAILED");
                }
            }
        }

        return () => {
            ws.close();
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const user = localStorage.getItem('exercise-user')
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
        setAnswer('loading...')

    }

    return (
        <div>
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
            <h2>
                {answer}
            </h2>
        </div>
    )
}

export default Answer;
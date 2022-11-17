import React from 'react';
import { v4 } from 'uuid'

const LoggedIn = () => {

    const user = localStorage.getItem('exercise-user');
    if(!user) {
        localStorage.setItem('exercise-user', v4())
    }

    return(
        <>
        </>
    );
}

export default LoggedIn;
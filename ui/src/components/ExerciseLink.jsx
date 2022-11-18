import React from 'react';

const ExerciseLink = ({ id, name, done}) => {

    return (
        <div
            className=""
        >
            {done ? 
            <a href={`/exercises/exercise-${id}`}
            style={{ display: "block", backgroundColor: "#22c55e", padding: "0.75rem", fontWeight: 700, maxWidth: 'max-content', color: "white", textDecoration: 'none',
            fontSize: "1rem",
            }}
            >
            {name}
            </a> :
            <a href={`/exercises/exercise-${id}`}
            style={{ display: "block", backgroundColor: "#ef4444", padding: "0.75rem", fontWeight: 700, maxWidth: 'max-content', color: "white", textDecoration: 'none',
            fontSize: "1rem",
            }}
            >
            {name}
            </a>}
        </div>
    )
}

export default ExerciseLink;
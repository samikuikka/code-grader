import React from 'react';

const ExerciseLink = ({ id, name}) => {

    return (
        <div
            className=""
        >
            <a href={`/exercises/exercise-${id}`}
            style={{ display: "block", backgroundColor: "rgb(96, 165, 250)", padding: "0.75rem", fontWeight: 700, maxWidth: 'max-content', color: "white", textDecoration: 'none',
                    fontSize: "1rem",
            }}
                
            >
            {name}
            </a>
        </div>
    )
}

export default ExerciseLink;
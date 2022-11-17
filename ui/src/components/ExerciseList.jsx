import React from 'react';
import ExerciseLink from './ExerciseLink';

const ExerciseList = () => {

    const names = ['Sum of three values', 'Sum with formula', 'Budget check', 'Mystery function', ' Sum of negative numbers', 'Average of positives', 'Team', 'Video and playlist']

    return (
        <div>
            <h2 className=" text-lg font-bold"> Exercises</h2>
            {names.map((name, index) => {
                return <ExerciseLink id={index +1} name={name}/>
            } )}
        </div>
    )
}

export default ExerciseList;
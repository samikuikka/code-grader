import React, { useState, useEffect} from 'react';
import ExerciseLink from './ExerciseLink';

const ExerciseList = () => {
    const [doneExercises, setDoneExercises] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Retrieving done exercises');
        const user = localStorage.getItem('exercise-user');
        console.log('User is:', user);
        fetch(`/api/results?id=${user}`).then( (res) => {
            return res.json();
        }
        ).then( data => {
            setDoneExercises(new Set(data.map(o => o.exercise)));
        })
        setLoading(false) 
    },[])

    const names = ['Sum of three values', 'Sum with formula', 'Budget check', 'Mystery function', ' Sum of negative numbers', 'Average of positives', 'Team', 'Video and playlist']

    if(loading) {
        return <div>Loading...</div>
    }

    const exerciseMap = new Map();
    for(let i = 0; i < names.length; i++) {
        exerciseMap.set(names[i],`exercise-${i+1}`);
    }

    console.log(doneExercises);
    return (
        <div>
            <h2 className=" text-lg font-bold"> Exercises</h2>
            <h3>NOT DONE</h3>
            {
                names.map((e , i) => [i, e]).filter( e => !doneExercises.has(exerciseMap.get(e[1]))).slice(0,3).map( e => {
                    return <ExerciseLink id={e[0] +1} name={e[1]} done={false}/>
                })
            }           
            <h3>DONE</h3>
            {
            names.map((name, index) => {
                if(doneExercises.has(exerciseMap.get(name))) {
                    return <ExerciseLink id={index +1} name={name} done={true}/>
                }
            })}
        </div>
    )
}

export default ExerciseList;
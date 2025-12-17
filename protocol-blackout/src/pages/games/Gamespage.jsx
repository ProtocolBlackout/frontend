import React from 'react'
import { useState } from 'react'
import Quiz from "./quiz/gameQuiz"


export default function Gamespage() {
    const [count, setCount] = useState(0)
    const [showQuiz, setShowQuiz] = useState(false)

    if (showQuiz) {
        return <Quiz onBack={() => setShowQuiz(false)} />
    }

 
    return (
        <>
            <h1>Willkommen in der Simulation</h1>
            <div style={{ margin: '1rem 0' }}>
                <h2>Quiz</h2>
                <p>Hier geht es zu unserem Quiz zum Thema Hacking und Cybersecurity</p>
                <button onClick={() => setShowQuiz(true)}>Zum Quiz</button>
            </div>

            {/* <div style={{ margin: '1rem 0' }}>
                <button onClick={() => setShowCracker(true)}>Zum Zum PasswordCracker</button>
            </div> */}
        </>
    )
}
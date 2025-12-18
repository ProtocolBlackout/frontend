import React from 'react'
import { useState } from 'react'
import Quiz from "./quiz/gameQuiz"
import GamePasswordCracker from './password-cracker/passwordCracker'


export default function Gamespage() {
    const [count, setCount] = useState(0)
    const [showQuiz, setShowQuiz] = useState(false)
    const [showCracker, setShowCracker] = useState(false)

    if (showQuiz) {
        return <Quiz onBack={() => setShowQuiz(false)} />
    }

    if (showCracker) {
        return <GamePasswordCracker onBack={() => setShowCracker(false)} />
    }

 
    return (
        <>
            <h1>Willkommen in der Simulation</h1>
            <div style={{ margin: '1rem 0' }}>
                <h2>Quiz</h2>
                <p>Hier geht es zu unserem Quiz zum Thema Hacking und Cybersecurity</p>
                <button onClick={() => setShowQuiz(true)}>Zum Quiz</button>
            </div>

            <div style={{ margin: '1rem 0' }}>
                <h2>Passwort Cracker</h2>
                <p>Na schaffst du es unsere Passwörter herauszufinden</p>
                <button onClick={() => setShowCracker(true)}>Zum Zum PasswordCracker</button>
            </div>
        </>
    )
}
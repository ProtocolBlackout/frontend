import React from 'react'
import { useState } from 'react'
import Quiz from "./quiz/gameQuiz"
import GamePasswordCracker from './password-cracker/passwordCracker'
import styles from "./Gamespage.module.css"


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
        <div className={styles.gamesPage}>
            <div className={styles.gamesConsole}>
                <div className={styles.gamesConsole__header}>
                    <div className={styles.gamesConsole__title}>Willkommen in der Simulation</div>
                    <div className={styles.gamesConsole__dots}>GAMES</div>
                </div>

                <div className={styles.gamesConsole__body}>
                    <div className={styles['games-block']}>
                        <h2 className={styles['games-block__heading']}>Quiz</h2>
                        <div className={styles['games-console__value']}>Hier geht es zu unserem Quiz zum Thema Hacking und Cybersecurity</div>
                        <button className={styles.gamesActionBtn} onClick={() => setShowQuiz(true)}>Zum Quiz</button>
                    </div>

                    <div className={styles['games-block']}>
                        <h2 className={styles['games-block__heading']}>Passwort Cracker</h2>
                        <div className={styles['games-console__value']}>Na schaffst du es unsere Passwörter herauszufinden</div>
                        <button className={styles.gamesActionBtn} onClick={() => setShowCracker(true)}>Zum PasswordCracker</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
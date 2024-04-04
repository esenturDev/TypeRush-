import { FC } from 'react';
import styles from './GameSummary.module.scss';

type GameSummaryProps = {
  calculateWPM: () => string | 0;
  points: number;
  mistakes: number;
  earnedPoints: number;
  handleReplay: () => void;
}

const GameSummary: FC<GameSummaryProps> = ({calculateWPM, points, mistakes, earnedPoints, handleReplay}) => {
  return (
    <div className={styles.wrapper}>
        <p>
        WPM: <span>{calculateWPM()}</span>
      </p>
      <p>
        Total Points: <span>{points - mistakes + earnedPoints}</span>
      </p>
      <p>
        Points Earned: <span>{earnedPoints}</span>
      </p>
      <p>
        Letter Mistakes: <span>{mistakes}</span>
      </p>
      <p>
        Total Points Calculation:{" "}
        <span>
          {`(${points} points) - (${mistakes} mistakes) + (${earnedPoints} earned points) = ${
            points - mistakes + earnedPoints
          }`}
        </span>
      </p>
      <button onClick={handleReplay} className={styles.replayButton}>
        Play Again
      </button>
    </div>
  )
}

export default GameSummary
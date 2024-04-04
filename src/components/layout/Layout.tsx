import { useEffect, useRef, useState } from "react";
import { useTypeRushState } from "../../util/store";
import NewHome from "../pages/NewHome";
import { texts } from "../../util/texts";
import styles from './Layout.module.scss'

const Layout = () => {
	const { points, earnedPoints, setPoints, setEarnedPoints } =
		useTypeRushState();
	const [mistakes, setMistakes] = useState<number>(0);
	const [input, setInput] = useState<string>("");
	const [capsLock, setCapsLock] = useState<boolean>(false);

	const [currentText, setCurrentText] = useState<string>(texts[0]);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [timer, setTimer] = useState<number>(30);

	useEffect(() => {
		setCurrentText(texts[Math.floor(Math.random() * texts.length)]);

		const focusInput = () => {
			setIsFocused(true);
			inputRef.current?.focus();
		};

		const handleClick = () => focusInput();

		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.getModifierState("CapsLock")) {
				setCapsLock(true);
			} else {
				setCapsLock(false);
			}
			focusInput();
		};

		window.addEventListener("keydown", handleKeyPress);
		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("click", handleClick);
		};
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isFocused && !isCompleted && timer > 0) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		} else if (timer <= 0) {
			setIsCompleted(true);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isFocused, isCompleted, timer]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!startTime) setStartTime(Date.now());
		if (isCompleted || timer <= 0) return;

		let newValue = event.target.value;
		let currentMistakes = mistakes;

		if (newValue.length >= currentText.length) {
			newValue = newValue.slice(0, currentText.length);
			setIsCompleted(true);
			setEndTime(Date.now());
			calculatePoints(currentMistakes);
		}

		if (!isCompleted && newValue.length > input.length) {
			const lastTypedChar = newValue[newValue.length - 1];
			const correctChar = currentText[newValue.length - 1];
			if (lastTypedChar !== correctChar) {
				currentMistakes += 1;
				setMistakes(currentMistakes);
			}
		}

		setInput(newValue);
	};

	const calculateWPM = () => {
		if (!startTime || !endTime) return 0;
		const timeTaken = (endTime - startTime) / 60000;
		const wordCount = currentText.slice().length;
		return (wordCount / timeTaken).toFixed(2);
	};

	const calculatePoints = (mistakes: number) => {
		const textLength = currentText.replace(/\s/g, "").length;
		let pointsEarned = 0;

		if (mistakes < textLength) {
			if (mistakes === 0) {
				pointsEarned = 100;
			} else if (mistakes <= 5) {
				pointsEarned = 80;
			} else if (mistakes <= 10) {
				pointsEarned = 60;
			} else if (mistakes <= 15) {
				pointsEarned = 40;
			} else {
				pointsEarned = 20;
			}
		}

		setEarnedPoints(pointsEarned);
	};

	const handleReplay = () => {
		setInput("");
		setMistakes(0);
		setIsCompleted(false);
		setEarnedPoints(0);
		setPoints(points + earnedPoints);
		inputRef.current?.focus();
		setTimer(30);
		setStartTime(null);
		setEndTime(null);
		setCurrentText(texts[Math.floor(Math.random() * texts.length)]);
		setPoints(points - mistakes + earnedPoints);
	};

	const renderText = (): JSX.Element[] => {
		const elements: JSX.Element[] = [];
		let inputIndex = 0;

		const textWords = currentText.slice(/\s+/);
		textWords.forEach((word, wordIndex) => {
			for (let i = 0; i < word.length; i++) {
				const char = word[i];
				const inputChar = input[inputIndex];
				const className = inputIndex < input.length ? inputChar === char ? styles.correctChar : styles.incorrectChar : styles.untypedChar;

				elements.push(
					<span key={`space-${wordIndex}-${i}`} className={className}>
						{char}
					</span>
				);
				inputIndex++;
			}

			if(wordIndex < textWords.length - 1) {
				elements.push(
					<span key={`space-${wordIndex}`} className={styles.spaceChar}></span>
				);
				inputIndex++;
			}
		});
		return elements;
	};

	return (
		<div className={styles.wrapper}>
			{!isFocused &&}
			{/* <NewHome /> */}
		</div>
	);
};

export default Layout;

import styles from "./FocusWrapper.module.scss";
import { PiCursorFill } from "react-icons/pi";

export const FocusWrapper = () => {
	return (
		<div className={styles.wrapper}>
			<h1>
				<PiCursorFill />
				Click or start typing for focus
			</h1>
		</div>
	);
};

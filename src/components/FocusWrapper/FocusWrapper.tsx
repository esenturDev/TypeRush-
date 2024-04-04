import styles from "./FocusWrapper.module.css";
import { PiCursorFill } from "react-icons/pi";

export default  function FocusWrapper () {
	return (
		<div className={styles.wrapper}>
			<h1>
				<PiCursorFill />
				Click or start typing for focus
			</h1>
		</div>
	);
}

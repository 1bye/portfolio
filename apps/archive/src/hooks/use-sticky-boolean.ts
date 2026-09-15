import { useEffect, useState } from "react";

/**
 * Returns `true` once `bool` has been `true` at least once,
 * and stays `true` forever after. Useful for deferring expensive
 * rendering (canvases, video players) until the user first interacts
 * with an element, then keeping the content mounted.
 */
export function useStickyBoolean(bool: boolean) {
	const [hasBeenSwitched, setHasBeenSwitched] = useState(false);

	useEffect(() => {
		if (bool && !hasBeenSwitched) {
			setHasBeenSwitched(true);
		}
	}, [bool, hasBeenSwitched]);

	return hasBeenSwitched;
}

import {
	type ComponentProps,
	forwardRef,
	type MutableRefObject,
	useCallback,
	useEffect,
	useRef,
} from "react";

export interface VideoPlayerProps extends Omit<ComponentProps<"video">, "src"> {
	played?: number;
	src: string;
}

export type VideoPlayerRef = HTMLVideoElement;

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
	function VideoPlayer(
		{
			controls = true,
			played,
			playsInline = true,
			preload = "metadata",
			src,
			...props
		},
		forwardedRef
	) {
		const videoRef = useRef<VideoPlayerRef | null>(null);

		const setRefs = useCallback(
			(node: VideoPlayerRef | null) => {
				videoRef.current = node;

				if (!forwardedRef) {
					return;
				}

				if (typeof forwardedRef === "function") {
					forwardedRef(node);
					return;
				}

				(forwardedRef as MutableRefObject<VideoPlayerRef | null>).current =
					node;
			},
			[forwardedRef]
		);

		useEffect(() => {
			const video = videoRef.current;
			if (!(video && played != null)) {
				return;
			}

			const seekToPlayedPosition = () => {
				if (!Number.isFinite(video.duration)) {
					return;
				}

				const targetSeconds = played <= 1 ? played * video.duration : played;
				if (
					!Number.isFinite(targetSeconds) ||
					targetSeconds < 0 ||
					targetSeconds > video.duration
				) {
					return;
				}

				if (Math.abs(video.currentTime - targetSeconds) < 0.25) {
					return;
				}

				video.currentTime = targetSeconds;
			};

			seekToPlayedPosition();
			video.addEventListener("loadedmetadata", seekToPlayedPosition);
			return () => {
				video.removeEventListener("loadedmetadata", seekToPlayedPosition);
			};
		}, [played]);

		return (
			<video
				controls={controls}
				playsInline={playsInline}
				preload={preload}
				ref={setRefs}
				src={src}
				{...props}
			/>
		);
	}
);

import {
	Maximize2Icon,
	Minimize2Icon,
	PauseIcon,
	PlayIcon,
	Volume2Icon,
	VolumeXIcon,
} from "lucide-react";
import {
	MediaControlBar,
	MediaController,
	MediaTimeRange,
} from "media-chrome/react";
import {
	MediaActionTypes,
	MediaProvider,
	useMediaDispatch,
	useMediaRef,
	useMediaSelector,
} from "media-chrome/react/media-store";
import {
	type ComponentProps,
	type CSSProperties,
	forwardRef,
	type MutableRefObject,
	type Ref,
	useCallback,
	useEffect,
} from "react";
import ReactPlayer from "react-player";
import { Button } from "./button";

export interface VideoPlayerProps {
	played?: number;
	src: string;
}

export type VideoPlayerRef = HTMLVideoElement;

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
	function VideoPlayer(props, ref) {
		return (
			<MediaProvider>
				<MediaController
					style={{
						width: "100%",
						aspectRatio: "16/9",
					}}
				>
					<VideoPlayerContent {...props} forwardedRef={ref} />
				</MediaController>
			</MediaProvider>
		);
	}
);

function VideoPlayerContent({
	src,
	played,
	forwardedRef,
}: VideoPlayerProps & { forwardedRef?: Ref<VideoPlayerRef> }) {
	const mediaRef = useMediaRef();
	const dispatch = useMediaDispatch();
	const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
	const mediaDuration = useMediaSelector((state) => state.mediaDuration);

	const reactPlayerNoWrapper = null as unknown as ComponentProps<
		typeof ReactPlayer
	>["wrapper"];

	const setRefs = useCallback(
		(node: VideoPlayerRef | null) => {
			mediaRef(node);
			if (!forwardedRef) {
				return;
			}
			if (typeof forwardedRef === "function") {
				forwardedRef(node);
				return;
			}
			(forwardedRef as MutableRefObject<VideoPlayerRef | null>).current = node;
		},
		[mediaRef, forwardedRef]
	);

	useEffect(() => {
		if (played == null) {
			return;
		}
		if (typeof mediaDuration !== "number" || Number.isNaN(mediaDuration)) {
			return;
		}

		const targetSeconds = played <= 1 ? played * mediaDuration : played;
		if (!Number.isFinite(targetSeconds)) {
			return;
		}
		if (targetSeconds < 0 || targetSeconds > mediaDuration) {
			return;
		}
		if (
			typeof mediaCurrentTime === "number" &&
			Number.isFinite(mediaCurrentTime) &&
			Math.abs(mediaCurrentTime - targetSeconds) < 0.25
		) {
			return;
		}

		dispatch({
			type: MediaActionTypes.MEDIA_SEEK_REQUEST,
			detail: targetSeconds,
		});
	}, [dispatch, mediaCurrentTime, mediaDuration, played]);

	return (
		<>
			<ReactPlayer
				controls={false}
				ref={setRefs}
				slot="media"
				src={src}
				style={
					{
						width: "100%",
						height: "100%",
						["--controls" as string]: "none",
					} as CSSProperties
				}
				wrapper={reactPlayerNoWrapper}
			/>

			<MediaControlBar className="bg-gradient-to-t bg-transparent from-black/50 p-2">
				<PlayButton />
				<MuteButton />
				<MediaTimeRange
					aria-label="Seek"
					className="ui-media-time-range mx-2 flex-1 pr-4"
				/>
				<FullscreenButton />
			</MediaControlBar>
		</>
	);
}

function PlayButton() {
	// Dispatch media state change requests using useMediaDispatch()
	const dispatch = useMediaDispatch();
	// Get the latest media state you care about in your component using useMediaSelector()
	const mediaPaused = useMediaSelector((state) => state.mediaPaused);
	return (
		<Button
			aria-label={mediaPaused ? "Play video" : "Pause video"}
			className="hover:bg-transparent hover:text-white hover:backdrop-blur-sm"
			onClick={() => {
				// Select from a set of well-defined actions for state change requests
				// using MediaActionTypes
				const type = mediaPaused
					? MediaActionTypes.MEDIA_PLAY_REQUEST
					: MediaActionTypes.MEDIA_PAUSE_REQUEST;
				dispatch({ type });
			}}
			size="icon-lg"
			variant="ghost"
		>
			{mediaPaused ? (
				<PlayIcon className="text-white [&_path]:fill-white" />
			) : (
				<PauseIcon className="text-white [&_rect]:fill-white" />
			)}
		</Button>
	);
}

function MuteButton() {
	const dispatch = useMediaDispatch();
	const mediaVolumeLevel = useMediaSelector((state) => state.mediaVolumeLevel);
	const mediaMuted = useMediaSelector((state) => state.mediaMuted);

	const isMuted = mediaMuted || mediaVolumeLevel === "off";

	return (
		<Button
			aria-label={isMuted ? "Unmute video" : "Mute video"}
			className="hover:bg-transparent hover:text-white hover:backdrop-blur-sm"
			onClick={() => {
				const type = isMuted
					? MediaActionTypes.MEDIA_UNMUTE_REQUEST
					: MediaActionTypes.MEDIA_MUTE_REQUEST;
				dispatch({ type });
			}}
			size="icon-lg"
			variant="ghost"
		>
			{isMuted ? (
				<VolumeXIcon className="text-white [&_path]:fill-white" />
			) : (
				<Volume2Icon className="text-white [&_path]:fill-white" />
			)}
		</Button>
	);
}

function FullscreenButton() {
	// Dispatch media state change requests using useMediaDispatch()
	const dispatch = useMediaDispatch();
	// Get the latest media state you care about in your component using useMediaSelector()
	const mediaIsFullscreen = useMediaSelector(
		(state) => state.mediaIsFullscreen
	);
	return (
		<Button
			aria-label={
				mediaIsFullscreen ? "Exit fullscreen video" : "Enter fullscreen video"
			}
			className="hover:bg-transparent hover:text-white hover:backdrop-blur-sm"
			onClick={() => {
				// Select from a set of well-defined actions for state change requests
				// using MediaActionTypes
				const type = mediaIsFullscreen
					? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
					: MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST;
				dispatch({ type });
			}}
			size="icon-lg"
			variant="ghost"
		>
			{mediaIsFullscreen ? (
				<Minimize2Icon className="text-white" />
			) : (
				<Maximize2Icon className="text-white" />
			)}
		</Button>
	);
}

import { SwitchHorizontalIcon, RewindIcon, PlayIcon, FastForwardIcon, PauseIcon, ReplyIcon, VolumeUpIcon } from "@heroicons/react/solid";
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useStore } from "../appStore";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { debounce } from "lodash";

function Player() {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const currentTrackId = useStore((state) => state.currentTrackId);
	const setCurrentTrackId = useStore((state) => state.setCurrentTrackId);
	const isPlaying = useStore((state) => state.isPlaying);
	const setIsPlaying = useStore((state) => state.setIsPlaying);
	const [volume, setVolume] = useState(50);
	const songInfo = useSongInfo();

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				console.log("Now Playing", data.body?.item);
				setCurrentTrackId(data.body?.item?.id);

				spotifyApi.getMyCurrentPlaybackState().then((data) => {
					setIsPlaying(data.body?.is_playing);
				});
			});
		}
	};

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}
		});
	};

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackId, spotifyApi, session]);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch((error) => {
				console.log(error);
			});
		}, 500),
		[]
	);

	return (
		<div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
			{/* Left */}
			<div className="flex items-center space-x-4">
				<img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} alt="" />
				<div>
					<h3>{songInfo?.name}</h3>
					<p>{songInfo?.artists?.[0]?.name}</p>
				</div>
			</div>

			{/* Center */}
			<div className="flex items-center justify-evenly">
				<SwitchHorizontalIcon className="player-button" />
				<RewindIcon className="player-button" />
				{isPlaying ? <PauseIcon onClick={handlePlayPause} className="player-button w-10 h-10" /> : <PlayIcon onClick={handlePlayPause} className="player-button w-10 h-10" />}
				<FastForwardIcon className="player-button" />
				<ReplyIcon className="player-button" />
			</div>

			{/* Right */}
			<div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
				<VolumeDownIcon onClick={() => (volume > 10 ? setVolume(volume - 10) : setVolume(0))} className="player-button" />
				<input className="w-14 md:w-28" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} />
				<VolumeUpIcon onClick={() => (volume < 90 ? setVolume(volume + 10) : setVolume(100))} className="player-button" />
			</div>
		</div>
	);
}
export default Player;

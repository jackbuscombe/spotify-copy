import { useState, useEffect } from "react";
import { useStore } from "../appStore";
import useSpotify from "../hooks/useSpotify";

function useSongInfo() {
	const spotifyApi = useSpotify();
	const currentTrackId = useStore((state) => state.currentTrackId);
	const setCurrentTrackId = useStore((state) => state.setCurrentTrackId);
	const [songInfo, setSongInfo] = useState(null);

	useEffect(() => {
		const fetchSongInfo = async () => {
			if (currentTrackId) {
				const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
					headers: {
						Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
					},
				}).then((res) => res.json());

				setSongInfo(trackInfo);
			}
		};

		fetchSongInfo();
	}, [currentTrackId, spotifyApi]);

	return songInfo;
}
export default useSongInfo;

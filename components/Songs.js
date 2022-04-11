import { useStore } from "../appStore";
import Song from "./Song";

function Songs() {
	const playlist = useStore((state) => state.playlist);
	return (
		<div className="text-white px-8 flex flex-col space-y-1 pb-28">
			{playlist?.tracks.items.map((track, i) => (
				<Song key={track.track.id} track={track} order={i} />
			))}
		</div>
	);
}
export default Songs;
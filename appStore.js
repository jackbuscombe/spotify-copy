import create from "zustand";

export const useStore = create((set) => ({
	playlistId: "7zLyqrGV0EoJUGwCG5WKew",
	setPlaylistId: (e) => set({ playlistId: e }),

	playlist: null,
	setPlaylist: (e) => set({ playlist: e }),

	currentTrackId: null,
	setCurrentTrackId: (e) => set({ currentTrackId: e }),

	isPlaying: false,
	setIsPlaying: (e) => set({ isPlaying: e }),
}));

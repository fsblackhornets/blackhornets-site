window.setupProjectVideo = () => {
	const video = document.getElementById("projectVideo");
	if (!video) return;

	video.addEventListener("loadeddata", () => video.play());
	video.addEventListener("ended", () => video.play());
	video.addEventListener("error", (e) =>
		console.error("Error loading video:", e),
	);
};

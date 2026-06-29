import { getTranslations } from "next-intl/server";
import { HeroBadges } from "./components/HeroBadges";

export async function AboutHero() {
	const t = await getTranslations("about.hero");

	return (
		<section className="relative h-[70vh] min-h-[500px] overflow-hidden flex flex-col items-center justify-center">
			{/* Video background */}
			<div className="absolute inset-0 z-0">
				<video
					autoPlay
					muted
					loop
					playsInline
					className="w-full h-full object-cover"
				>
					<source src="/videos/formula-red.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/65" />
			</div>

			{/* Racing stripe */}
			<div
				className="absolute top-0 left-0 right-0 z-20 flex"
				style={{ height: "4px" }}
			>
				<div style={{ flex: 1, background: "#ffd700" }} />
				<div style={{ flex: 0.12, background: "transparent" }} />
				<div style={{ flex: 0.05, background: "#ffd700" }} />
			</div>

			{/* ABOUT watermark */}
			<div
				className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
				aria-hidden="true"
			>
				<span
					className="font-heading font-black text-white"
					style={{
						fontSize: "clamp(6rem, 28vw, 20rem)",
						opacity: 0.04,
						letterSpacing: "0.1em",
						lineHeight: 1,
					}}
				>
					ABOUT
				</span>
			</div>

			{/* Content */}
			<div className="relative z-10 text-center px-8 flex flex-col items-center">
				{/* Stacked title */}
				<h1
					className="font-heading font-black leading-[1.05]"
					style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
				>
					<span className="block text-white">{t("line1")}</span>
					<span
						className="block"
						style={{
							background: "linear-gradient(90deg, #ffd700, #ffc107)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						{t("line2")}
					</span>
				</h1>

				{/* Subtitle */}
				<p
					className="font-body font-light text-text-light mt-4"
					style={{
						fontSize: "0.7rem",
						letterSpacing: "0.35em",
						textTransform: "uppercase",
					}}
				>
					{t("subtitle")}
				</p>

				{/* Speed lines */}
				<div className="flex flex-col items-center gap-1.5 my-6">
					<div
						style={{ width: "60px", height: "2px", background: "#ffd700" }}
					/>
					<div
						style={{
							width: "40px",
							height: "1.5px",
							background: "#ffd700",
							opacity: 0.55,
						}}
					/>
					<div
						style={{
							width: "24px",
							height: "1px",
							background: "#ffd700",
							opacity: 0.25,
						}}
					/>
				</div>

				<HeroBadges />
			</div>

			{/* Gold bottom border */}
			<div
				className="absolute bottom-0 left-0 right-0 z-20"
				style={{ height: "3px", background: "#ffd700" }}
			/>
		</section>
	);
}

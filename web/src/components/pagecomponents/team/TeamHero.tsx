import { getTranslations } from "next-intl/server";

export async function TeamHero() {
	const t = await getTranslations("team.hero");

	return (
		<section
			className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden"
			style={{ background: "#080808" }}
		>
			{/* Racing stripe */}
			<div className="absolute top-0 left-0 right-0 z-20 flex h-[3px]">
				<div className="flex-1 bg-primary" />
				<div className="w-[80px] bg-bg-dark" />
				<div className="w-[30px] bg-primary" />
			</div>

			{/* TEAM watermark */}
			<div
				className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
				aria-hidden="true"
			>
				<span
					className="font-heading font-black text-white"
					style={{
						fontSize: "220px",
						opacity: 0.03,
						letterSpacing: "0.1em",
						lineHeight: 1,
					}}
				>
					TEAM
				</span>
			</div>

			{/* Content */}
			<div className="relative z-10 text-center px-8 flex flex-col items-center">
				<h1 className="font-heading text-[44px] font-black tracking-[3px] uppercase leading-[1.05]">
					<span className="block text-white">{t("line1")}</span>
					<span className="block bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
						{t("line2")}
					</span>
				</h1>

				{/* Speed lines */}
				<div className="flex gap-1.5 items-center my-5">
					<div
						style={{
							width: "52px",
							height: "2px",
							background: "#ffd700",
							opacity: 0.9,
						}}
					/>
					<div
						style={{
							width: "16px",
							height: "1.5px",
							background: "#ffd700",
							opacity: 0.5,
						}}
					/>
					<div
						style={{
							width: "8px",
							height: "1px",
							background: "#ffd700",
							opacity: 0.2,
						}}
					/>
				</div>

				<p className="font-body font-light text-text-gray text-xs tracking-[4px] uppercase">
					{t("subtitle")}
				</p>
			</div>

			{/* Gold bottom border */}
			<div
				className="absolute bottom-0 left-0 right-0 z-20"
				style={{ height: "3px", background: "#ffd700" }}
			/>
		</section>
	);
}

import { getTranslations } from "next-intl/server";

export async function SponsorsHero() {
	const t = await getTranslations("sponsors.hero");

	return (
		<section className="relative h-[52vh] min-h-[360px] overflow-hidden flex items-center justify-center">
			{/* Racing stripe */}
			<div className="flex h-[4px] absolute top-0 inset-x-0 z-20">
				<div className="flex-1 bg-primary" />
				<div className="w-16 bg-transparent" />
				<div className="w-7 bg-primary" />
			</div>

			{/* Background */}
			<div
				className="absolute inset-0 z-0"
				style={{
					background:
						"linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)",
				}}
			/>

			{/* SPONSORS watermark */}
			<div
				className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
				aria-hidden="true"
			>
				<span
					className="font-heading font-black text-white"
					style={{
						fontSize: "160px",
						opacity: 0.03,
						letterSpacing: "-3px",
						lineHeight: 1,
					}}
				>
					SPONSORS
				</span>
			</div>

			{/* Content */}
			<div className="relative z-20 text-center px-8 flex flex-col items-center">
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
				className="absolute bottom-0 inset-x-0 z-20"
				style={{ height: "3px", background: "#ffd700" }}
			/>
		</section>
	);
}

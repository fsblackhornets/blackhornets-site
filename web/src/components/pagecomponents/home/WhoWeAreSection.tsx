import { getTranslations } from "next-intl/server";

export async function WhoWeAreSection() {
	const t = await getTranslations("home.whoWeAre");

	return (
		<section className="my-20 max-w-screen-2xl mx-auto px-4">
			{/* Heading */}
			<div className="text-center mb-12">
				<h2
					className="font-heading uppercase text-text-light"
					style={{
						fontSize: "clamp(2rem, 6vw, 3.5rem)",
						letterSpacing: "0.2em",
					}}
				>
					{t("heading")}
				</h2>
				<div
					style={{
						width: "64px",
						height: "2px",
						background: "#ffd700",
						margin: "12px auto 0",
					}}
				/>
			</div>

			{/* Quote block */}
			<div
				className="relative mb-10"
				style={{
					borderTop: "3px solid #ffd700",
					borderRight: "1px solid rgba(255,215,0,0.3)",
					borderBottom: "1px solid rgba(255,215,0,0.3)",
					borderLeft: "1px solid rgba(255,215,0,0.3)",
					background: "rgba(255,215,0,0.03)",
					padding: "3rem 2.5rem 2rem",
				}}
			>
				{/* " badge sitting on top border */}
				<span
					className="font-heading font-black text-primary absolute"
					aria-hidden="true"
					style={{
						top: "-1.8rem",
						left: "2rem",
						fontSize: "5rem",
						lineHeight: 1,
						background: "#111111",
						padding: "0 0.25rem",
					}}
				>
					&ldquo;
				</span>
				<p
					className="font-body italic text-text-light leading-[1.9]"
					style={{ fontSize: "1.15rem" }}
				>
					{t("quote")}
				</p>
			</div>

			{/* 2-col text grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<p className="font-body text-text-gray leading-[1.8]">{t("p1")}</p>
				<p className="font-body text-text-gray leading-[1.8]">{t("p2")}</p>
			</div>
		</section>
	);
}

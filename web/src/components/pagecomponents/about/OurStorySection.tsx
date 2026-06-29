import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { STAT_ITEMS } from "@/constants/about";
import { fetchMemberCount } from "@/lib/api/team";

const STAT_KEYS = ["statTeamMembers", "statDepartments", "statAwards"] as const;

export async function OurStorySection() {
	const [memberCount, t] = await Promise.all([
		fetchMemberCount(),
		getTranslations("about.story"),
	]);
	const statValues = [memberCount ?? "—", 8, 0];

	return (
		<section className="py-20 px-4">
			<div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				{/* Left column */}
				<div className="flex flex-col gap-8">
					{/* Label + heading */}
					<div className="flex flex-col gap-3">
						<span className="font-heading text-primary text-xs tracking-widest uppercase">
							{t("label")}
						</span>
						<div
							className="font-heading font-black leading-[1.05]"
							style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
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
						</div>
					</div>

					{/* Body text */}
					<div className="flex flex-col gap-4">
						<p className="font-body text-text-gray leading-relaxed">
							{t("p1")}
						</p>
						<p className="font-body text-text-gray leading-relaxed">
							{t("p2")}
						</p>
					</div>

					{/* Stats grid */}
					<div
						className="grid grid-cols-3"
						style={{ border: "1px solid #1e1e1e" }}
					>
						{STAT_ITEMS.map((_item, i) => (
							<div
								key={STAT_KEYS[i]}
								className="flex flex-col items-center gap-1 py-7 px-4"
								style={{
									borderRight: i < 2 ? "1px solid #1e1e1e" : "none",
								}}
							>
								<span
									className="font-heading font-black text-primary"
									style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
								>
									{statValues[i]}
								</span>
								<span className="font-body text-text-gray text-xs tracking-widest uppercase text-center">
									{t(STAT_KEYS[i])}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Right column — image with gold corner accents */}
				<div className="relative h-72 lg:h-full min-h-[400px]">
					{/* Top-right corner */}
					<div
						className="absolute z-10"
						style={{
							top: "-8px",
							right: "-8px",
							width: "24px",
							height: "24px",
							borderTop: "2px solid #ffd700",
							borderRight: "2px solid #ffd700",
						}}
					/>
					{/* Bottom-left corner */}
					<div
						className="absolute z-10"
						style={{
							bottom: "-8px",
							left: "-8px",
							width: "24px",
							height: "24px",
							borderBottom: "2px solid #ffd700",
							borderLeft: "2px solid #ffd700",
						}}
					/>
					<Image
						src="/images/team-photo.jpg"
						alt="Black Hornets Team"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				</div>
			</div>
		</section>
	);
}

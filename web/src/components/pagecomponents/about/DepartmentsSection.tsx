import { getTranslations } from "next-intl/server";
import { DEPARTMENTS } from "@/constants/about";

const DEPT_KEYS = [
	"marketing",
	"sponsorships",
	"management",
	"chassis",
	"suspension",
	"transmission",
	"highVoltage",
	"lowVoltage",
] as const;

export async function DepartmentsSection() {
	const t = await getTranslations("about.departments");

	return (
		<section className="py-20 px-4" style={{ background: "#1a1a1a" }}>
			<div className="max-w-screen-2xl mx-auto">
				{/* Header */}
				<div className="mb-12">
					<span className="font-heading text-primary text-xs tracking-widest uppercase block mb-3">
						{t("label")}
					</span>
					<h2
						className="font-heading font-black text-white leading-tight"
						style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
					>
						{t("heading")}{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							{t("headingGold")}
						</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{DEPARTMENTS.map(({ Icon }, i) => {
						const key = DEPT_KEYS[i];
						return (
							<div
								key={key}
								className="flex flex-col gap-3 transition-colors duration-200"
								style={{
									background: "#111111",
									border: "1px solid #1e1e1e",
									borderTop:
										i === 0
											? "2px solid #ffd700"
											: "2px solid rgba(255,215,0,0.35)",
									borderRadius: "3px",
									padding: "20px 18px",
								}}
							>
								<Icon className="w-6 h-6 text-primary" />
								<h3 className="font-heading text-primary text-xs tracking-widest uppercase">
									{t(`${key}.title` as Parameters<typeof t>[0])}
								</h3>
								<p
									className="font-body text-text-gray leading-relaxed"
									style={{ fontSize: "0.8rem" }}
								>
									{t(`${key}.description` as Parameters<typeof t>[0])}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

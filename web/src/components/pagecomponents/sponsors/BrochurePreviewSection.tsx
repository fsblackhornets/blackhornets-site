import { getTranslations } from "next-intl/server";
import { BrochureViewerLoader } from "./BrochureViewerLoader";

export async function BrochurePreviewSection() {
	const t = await getTranslations("sponsors.preview");

	return (
		<section className="py-20 px-4 bg-[#0b0b0b]">
			<div className="max-w-screen-2xl mx-auto">
				<div className="mb-12 text-center">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
						{t("label")}
					</span>
					<h2 className="font-heading font-black text-white text-2xl leading-tight">
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

				<div className="max-w-5xl mx-auto border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm overflow-hidden bg-bg-panel py-8">
					<BrochureViewerLoader
						loading={t("loading")}
						fallback={t("fallback")}
						fallbackLink={t("fallbackLink")}
					/>
				</div>
			</div>
		</section>
	);
}

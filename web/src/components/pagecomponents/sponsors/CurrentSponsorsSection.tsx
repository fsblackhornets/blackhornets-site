import { SPONSOR_TIERS } from "@/constants/sponsors";
import { fetchSponsors, groupSponsorsByTier } from "@/lib/api/sponsors";
import { TierGroup } from "./components/TierGroup";

export async function CurrentSponsorsSection() {
	const sponsors = await fetchSponsors();
	const grouped = groupSponsorsByTier(sponsors);
	const hasSponsors = sponsors.length > 0;

	return (
		<section className="py-20 px-4">
			<div className="max-w-screen-2xl mx-auto">
				{/* Section header */}
				<div className="mb-12">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
						Partners
					</span>
					<h2 className="font-heading font-black text-white text-2xl leading-tight">
						Our{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							Sponsors
						</span>
					</h2>
				</div>

				{hasSponsors ? (
					SPONSOR_TIERS.map((tier) => (
						<TierGroup key={tier} tier={tier} sponsors={grouped[tier]} />
					))
				) : (
					<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-12 text-center">
						<svg
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="rgba(255,215,0,.4)"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mx-auto mb-4"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="10" />
							<polyline points="12 6 12 12 16 14" />
						</svg>
						<p className="font-heading text-[13px] tracking-[3px] uppercase text-primary mb-2">
							Coming Soon
						</p>
						<p className="font-body text-text-gray text-sm">
							Partnerships being confirmed. Stay tuned!
						</p>
					</div>
				)}
			</div>
		</section>
	);
}

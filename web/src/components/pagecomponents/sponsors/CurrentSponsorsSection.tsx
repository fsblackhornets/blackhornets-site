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
				<div className="text-center mb-12">
					<h2 className="font-heading text-[clamp(2rem,5vw,3rem)] uppercase tracking-[3px] bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
						Our Sponsors
					</h2>
					<div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
				</div>

				{hasSponsors ? (
					SPONSOR_TIERS.map((tier) => (
						<TierGroup key={tier} tier={tier} sponsors={grouped[tier]} />
					))
				) : (
					<div className="text-center py-16 text-text-gray">
						<i
							className="fas fa-clock text-4xl text-primary mb-4 block"
							aria-hidden="true"
						/>
						<h3 className="font-heading text-xl text-primary mb-2">
							Coming Soon
						</h3>
						<p>Partnerships being confirmed. Stay tuned!</p>
					</div>
				)}
			</div>
		</section>
	);
}

import Image from "next/image";
import { fetchMemberCount } from "@/lib/api/team";
import { StatItem } from "./components/StatItem";
import { STAT_ITEMS } from "./constants";

export async function OurStorySection() {
	const memberCount = await fetchMemberCount();
	const statValues = [memberCount ?? "—", 8, 0];

	return (
		<section className="py-20 px-4">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div className="flex flex-col gap-8">
					<div>
						<h2 className="font-heading text-[clamp(2rem,5vw,3rem)] uppercase tracking-[3px] bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent mb-4">
							Our Story
						</h2>
						<p className="text-text-light leading-relaxed">
							Black Hornets Racing was founded by a group of passionate
							engineering students. What started as a small project has grown
							into one of the most dynamic Formula Student teams in the region.
						</p>
					</div>

					<div className="grid grid-cols-3 gap-6 bg-bg-panel rounded-2xl border border-gray-mid p-8">
						{STAT_ITEMS.map(({ Icon, label }, i) => (
							<StatItem key={label} Icon={Icon} value={statValues[i]} label={label} />
						))}
					</div>
				</div>

				<div className="relative h-72 lg:h-full min-h-[300px] rounded-2xl overflow-hidden">
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

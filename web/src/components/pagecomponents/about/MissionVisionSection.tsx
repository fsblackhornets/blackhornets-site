import { MissionIcon } from "@/components/icons/MissionIcon";
import { VisionIcon } from "@/components/icons/VisionIcon";

export function MissionVisionSection() {
	return (
		<section className="py-20 px-4">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="bg-bg-panel rounded-2xl border border-primary/20 p-10 text-center flex flex-col items-center gap-4">
					<MissionIcon className="w-10 h-10 text-primary" />
					<h3 className="font-heading text-xl tracking-widest text-primary uppercase">
						Our Mission
					</h3>
					<p className="text-text-gray leading-relaxed">
						Develop innovative racing solutions, providing students passionate
						about motorsport with hands-on engineering experience.
					</p>
				</div>

				<div className="bg-bg-panel rounded-2xl border border-primary/20 p-10 text-center flex flex-col items-center gap-4">
					<VisionIcon className="w-10 h-10 text-primary" />
					<h3 className="font-heading text-xl tracking-widest text-primary uppercase">
						Our Vision
					</h3>
					<p className="text-text-gray leading-relaxed">
						Become the leading Formula Student team, known for technical
						innovation and professional development of future engineers.
					</p>
				</div>
			</div>
		</section>
	);
}

import { MissionIcon } from "@/components/icons/MissionIcon";
import { VisionIcon } from "@/components/icons/VisionIcon";

export function MissionVisionSection() {
	return (
		<section className="px-4 py-20" style={{ borderTop: "3px solid #ffd700" }}>
			<div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2">
				{/* Mission */}
				<div
					className="relative overflow-hidden p-12"
					style={{ borderRight: "1px solid #181818" }}
				>
					{/* M watermark */}
					<div
						className="absolute bottom-0 right-0 pointer-events-none select-none font-heading font-black text-white"
						aria-hidden="true"
						style={{
							fontSize: "14rem",
							opacity: 0.03,
							lineHeight: 1,
							transform: "translate(20%, 20%)",
						}}
					>
						M
					</div>

					<div className="relative z-10 flex flex-col gap-5">
						<div
							className="w-14 h-14 flex items-center justify-center"
							style={{
								border: "1.5px solid rgba(255,215,0,0.3)",
								borderRadius: "50%",
							}}
						>
							<MissionIcon className="w-6 h-6 text-primary" />
						</div>
						<span className="font-heading text-primary text-xs tracking-widest uppercase">
							Our Mission
						</span>
						<h3
							className="font-heading font-black text-white leading-tight"
							style={{ fontSize: "1.25rem" }}
						>
							Drive Innovation
						</h3>
						<p className="font-body text-text-gray leading-relaxed">
							Develop innovative racing solutions, providing students passionate
							about motorsport with hands-on engineering experience.
						</p>
					</div>
				</div>

				{/* Vision */}
				<div className="relative overflow-hidden p-12">
					{/* V watermark */}
					<div
						className="absolute bottom-0 right-0 pointer-events-none select-none font-heading font-black text-white"
						aria-hidden="true"
						style={{
							fontSize: "14rem",
							opacity: 0.03,
							lineHeight: 1,
							transform: "translate(20%, 20%)",
						}}
					>
						V
					</div>

					<div className="relative z-10 flex flex-col gap-5">
						<div
							className="w-14 h-14 flex items-center justify-center"
							style={{
								border: "1.5px solid rgba(255,215,0,0.3)",
								borderRadius: "50%",
							}}
						>
							<VisionIcon className="w-6 h-6 text-primary" />
						</div>
						<span className="font-heading text-primary text-xs tracking-widest uppercase">
							Our Vision
						</span>
						<h3
							className="font-heading font-black text-white leading-tight"
							style={{ fontSize: "1.25rem" }}
						>
							Lead the Future
						</h3>
						<p className="font-body text-text-gray leading-relaxed">
							Become the leading Formula Student team, known for technical
							innovation and professional development of future engineers.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

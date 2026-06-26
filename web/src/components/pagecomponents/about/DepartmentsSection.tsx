import { DEPARTMENTS } from "./constants";

export function DepartmentsSection() {
	return (
		<section className="py-20 px-4 bg-bg-panel">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="font-heading text-[clamp(2rem,5vw,3rem)] uppercase tracking-[3px] bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
						Our Departments
					</h2>
					<div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{DEPARTMENTS.map(({ Icon, title, description }) => (
						<div
							key={title}
							className="bg-bg-dark rounded-xl border border-gray-mid p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 hover:border-primary/40 transition-all duration-200"
						>
							<Icon className="w-8 h-8 text-primary" />
							<h3 className="font-heading text-sm tracking-widest text-primary uppercase">
								{title}
							</h3>
							<p className="text-text-gray text-sm leading-relaxed">
								{description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

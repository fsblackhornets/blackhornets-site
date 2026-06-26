import type { Metadata } from "next";
import { GearIcon } from "@/components/icons/GearIcon";
import { FeaturedProjectCard } from "@/components/pagecomponents/projects/components/FeaturedProjectCard";
import { PaginatedProjects } from "@/components/pagecomponents/projects/components/PaginatedProjects";
import { ProjectCard } from "@/components/pagecomponents/projects/components/ProjectCard";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";
import { fetchProjects } from "@/lib/api/projects";

export const metadata: Metadata = {
	title: `Projects — ${SITE_NAME}`,
	description:
		"Explore the engineering projects of Black Hornets Racing. Our Formula Student race cars, technical innovations, and design evolution.",
	openGraph: {
		title: `Projects — ${SITE_NAME}`,
		description: "Explore the engineering projects of Black Hornets Racing.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default async function ProjectsPage() {
	const projects = await fetchProjects();

	const featured = projects[0] ?? null;
	const highlights = projects.slice(1, 3);
	const remaining = projects.slice(3);

	return (
		<>
			{/* Hero */}
			<section className="relative py-32 flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, transparent 70%)",
					}}
				/>
				<div className="hero-grid-overlay absolute inset-0" />
				<div className="relative z-10 text-center px-8">
					<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
						Our Projects
					</h1>
					<p className="text-text-light text-xl tracking-widest mt-4">
						Discover our innovative racing solutions and engineering achievements.
					</p>
					<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
				</div>
			</section>

			<section className="py-20 px-4 max-w-screen-2xl mx-auto">
				{projects.length === 0 ? (
					<div className="min-h-[40vh] flex items-center justify-center">
						<div className="text-center bg-bg-panel border border-primary rounded-2xl p-12 max-w-lg w-full shadow-[0_0_30px_rgba(255,215,0,0.1)]">
							<div className="flex justify-center gap-2 mb-6">
								<GearIcon className="w-12 h-12 text-primary animate-spin" />
								<GearIcon className="w-9 h-9 text-primary animate-[spin_3s_linear_infinite_reverse]" />
							</div>
							<h2 className="font-heading text-2xl uppercase tracking-[3px] text-primary mb-4">
								Projects Coming Soon
							</h2>
							<p className="text-text-gray">
								We&apos;re working on exciting new projects. Stay tuned!
							</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-10">
						{/* Section header */}
						<div>
							<h2 className="font-heading text-[clamp(1.2rem,3vw,1.8rem)] uppercase tracking-[3px] bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
								Most Recent Projects
							</h2>
							<div className="w-16 h-0.5 bg-primary mt-3" />
						</div>

						{/* Featured */}
						{featured && <FeaturedProjectCard project={featured} />}

						{/* Highlights */}
						{highlights.length > 0 && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{highlights.map((project) => (
									<ProjectCard key={project.id} project={project} />
								))}
							</div>
						)}

						{/* Remaining — client-side paginated with fade */}
						{remaining.length > 0 && (
							<PaginatedProjects projects={remaining} />
						)}
					</div>
				)}
			</section>
		</>
	);
}

import type { Metadata } from "next";
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

	return (
		<>
			<section className="relative py-32 flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, transparent 70%)",
					}}
				/>
				<div className="relative z-10 text-center px-8">
					<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
						Our Projects
					</h1>
					<p className="text-text-light text-xl tracking-widest mt-4">
						Discover our innovative racing solutions and engineering
						achievements.
					</p>
					<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
				</div>
			</section>

			<section className="py-20 px-4 max-w-[1100px] mx-auto">
				{projects.length === 0 ? (
					<div className="min-h-[40vh] flex items-center justify-center">
						<div className="text-center bg-bg-panel border border-primary rounded-2xl p-12 max-w-lg w-full shadow-[0_0_30px_rgba(255,215,0,0.1)]">
							<div className="flex justify-center gap-2 mb-6">
								<i
									className="fas fa-cog text-5xl text-primary animate-spin"
									aria-hidden="true"
								/>
								<i
									className="fas fa-cog text-4xl text-primary animate-[spin_3s_linear_infinite_reverse]"
									aria-hidden="true"
								/>
							</div>
							<h2 className="font-heading text-2xl uppercase tracking-[3px] text-primary mb-4">
								Projects Coming Soon
							</h2>
							<p className="text-text-gray">
								We&apos;re working on exciting new projects. Stay tuned!
							</p>
							<div className="mt-6 h-1 bg-gray-mid rounded overflow-hidden">
								<div className="h-full w-[30%] bg-primary animate-[progress_2s_ease-in-out_infinite]" />
							</div>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{projects.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				)}
			</section>
		</>
	);
}

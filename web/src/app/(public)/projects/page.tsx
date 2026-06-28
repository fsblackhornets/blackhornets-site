import type { Metadata } from "next";
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
			<section
				className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden"
				style={{ background: "#080808" }}
			>
				{/* Racing stripe */}
				<div className="absolute top-0 left-0 right-0 z-20 flex h-[3px]">
					<div className="flex-1 bg-primary" />
					<div className="w-[80px] bg-bg-dark" />
					<div className="w-[30px] bg-primary" />
				</div>

				{/* PROJECTS watermark */}
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
					aria-hidden="true"
				>
					<span
						className="font-heading font-black text-white"
						style={{
							fontSize: "180px",
							opacity: 0.03,
							letterSpacing: "-4px",
							lineHeight: 1,
						}}
					>
						PROJECTS
					</span>
				</div>

				{/* Content */}
				<div className="relative z-10 text-center px-8 flex flex-col items-center">
					<h1 className="font-heading text-[44px] font-black tracking-[3px] uppercase leading-[1.05]">
						<span className="block text-white">Our</span>
						<span className="block bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
							Projects
						</span>
					</h1>

					{/* Speed lines */}
					<div className="flex gap-1.5 items-center my-5">
						<div
							style={{
								width: "52px",
								height: "2px",
								background: "#ffd700",
								opacity: 0.9,
							}}
						/>
						<div
							style={{
								width: "16px",
								height: "1.5px",
								background: "#ffd700",
								opacity: 0.5,
							}}
						/>
						<div
							style={{
								width: "8px",
								height: "1px",
								background: "#ffd700",
								opacity: 0.2,
							}}
						/>
					</div>

					<p className="font-body font-light text-text-gray text-xs tracking-[4px] uppercase">
						Engineering innovation on and off the track
					</p>
				</div>

				{/* Gold bottom border */}
				<div
					className="absolute bottom-0 left-0 right-0 z-20"
					style={{ height: "3px", background: "#ffd700" }}
				/>
			</section>

			<section className="py-20 px-4 max-w-screen-2xl mx-auto">
				{projects.length === 0 ? (
					<div className="min-h-[40vh] flex items-center justify-center">
						<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-12 flex flex-col items-center gap-4 max-w-lg w-full">
							{/* Gear icons */}
							<div className="flex gap-3 items-center">
								<svg
									width="40"
									height="40"
									viewBox="0 0 24 24"
									fill="none"
									stroke="rgba(255,215,0,.4)"
									strokeWidth="1.5"
									aria-hidden="true"
								>
									<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
									<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
								</svg>
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="rgba(255,215,0,.4)"
									strokeWidth="1.5"
									aria-hidden="true"
								>
									<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
									<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
								</svg>
							</div>

							{/* Racing stripe divider */}
							<div className="flex h-[2px] w-10">
								<div className="flex-1 bg-primary" />
								<div className="w-2 bg-bg-dark" />
								<div className="w-1 bg-primary" />
							</div>

							<p className="font-heading text-[13px] tracking-[3px] text-primary uppercase">
								Projects Coming Soon
							</p>
							<p className="font-body text-[9px] text-text-gray text-center">
								We&apos;re working on exciting new projects. Stay tuned!
							</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-10">
						{/* Section header */}
						<div className="flex items-end justify-between">
							<div>
								<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
									Engineering
								</span>
								<h2 className="font-heading font-black text-white leading-tight text-2xl">
									Most Recent{" "}
									<span
										style={{
											background: "linear-gradient(90deg, #ffd700, #ffc107)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											backgroundClip: "text",
										}}
									>
										Projects
									</span>
								</h2>
							</div>
							<span className="font-heading text-[9px] tracking-[2px] text-text-gray uppercase">
								{projects.length} project{projects.length !== 1 ? "s" : ""}
							</span>
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
						{remaining.length > 0 && <PaginatedProjects projects={remaining} />}
					</div>
				)}
			</section>
		</>
	);
}

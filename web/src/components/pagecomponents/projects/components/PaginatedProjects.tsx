"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

const PER_PAGE = 6;

export function PaginatedProjects({ projects }: { projects: Project[] }) {
	const [page, setPage] = useState(1);
	const [fading, setFading] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);

	const totalPages = Math.ceil(projects.length / PER_PAGE);
	const visible = projects.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const goTo = useCallback(
		(next: number) => {
			if (next === page || next < 1 || next > totalPages) return;
			setFading(true);
			setTimeout(() => {
				setPage(next);
				setFading(false);
			}, 220);
		},
		[page, totalPages],
	);

	if (projects.length === 0) return null;

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div ref={sectionRef}>
			{/* Divider */}
			<div className="flex items-center gap-4 mb-8">
				<div className="flex-1 h-px bg-gray-mid" />
				<span className="font-heading text-xs tracking-[4px] text-text-gray uppercase">
					More Projects
				</span>
				<div className="flex-1 h-px bg-gray-mid" />
			</div>

			{/* Grid with fade */}
			<div
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-200"
				style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)" }}
			>
				{visible.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-10">
					<button
						type="button"
						onClick={() => goTo(page - 1)}
						disabled={page === 1}
						className="p-2 rounded-lg border border-gray-mid text-text-gray hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>

					{pages.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => goTo(p)}
							className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-heading transition-colors ${
								p === page
									? "border-primary bg-primary/10 text-primary"
									: "border-gray-mid text-text-gray hover:border-primary hover:text-primary"
							}`}
						>
							{p}
						</button>
					))}

					<button
						type="button"
						onClick={() => goTo(page + 1)}
						disabled={page === totalPages}
						className="p-2 rounded-lg border border-gray-mid text-text-gray hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
}

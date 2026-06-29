"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
				<div className="flex-1 h-px bg-[#1c1c1c]" />
				<span
					className="font-heading text-xs tracking-[4px] uppercase"
					style={{ color: "#333" }}
				>
					More Projects
				</span>
				<div className="flex-1 h-px bg-[#1c1c1c]" />
			</div>

			{/* Grid with fade */}
			<div
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-200"
				style={{
					opacity: fading ? 0 : 1,
					transform: fading ? "translateY(8px)" : "translateY(0)",
				}}
			>
				{visible.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-10">
					{/* Prev */}
					<button
						type="button"
						onClick={() => goTo(page - 1)}
						disabled={page === 1}
						className="w-[30px] h-[30px] flex items-center justify-center border border-[#222] text-text-gray hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
					>
						<ChevronLeft size={14} strokeWidth={2.5} aria-hidden="true" />
					</button>

					{/* Page numbers */}
					{pages.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => goTo(p)}
							className="w-9 h-9 flex items-center justify-center text-sm font-heading transition-colors"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								background: p === page ? "rgba(255,215,0,0.10)" : "transparent",
								border: `1px solid ${p === page ? "#ffd700" : "#222"}`,
								color: p === page ? "#ffd700" : "#555",
							}}
						>
							{p}
						</button>
					))}

					{/* Next */}
					<button
						type="button"
						onClick={() => goTo(page + 1)}
						disabled={page === totalPages}
						className="w-[30px] h-[30px] flex items-center justify-center border border-[#222] text-text-gray hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
					>
						<ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
					</button>
				</div>
			)}
		</div>
	);
}

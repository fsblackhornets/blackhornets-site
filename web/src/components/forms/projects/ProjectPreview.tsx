"use client";

import { Calendar, Clock } from "lucide-react";
import { formatDate, getProjectStatusVariant } from "@/lib/utils/utils";

interface ProjectPreviewProps {
	name: string;
	status: string;
	description: string;
	dueDate: string;
	duration: string;
	progress: number;
	previewUrl: string | null;
}

export function ProjectPreview({
	name,
	status,
	description,
	dueDate,
	duration,
	progress,
	previewUrl,
}: ProjectPreviewProps) {
	const variant = getProjectStatusVariant(status);

	return (
		<div>
			<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-3">
				Live Preview
			</p>
			<div className="bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 overflow-hidden flex flex-col">
				<div className="relative h-48 bg-bg-dark overflow-hidden">
					{previewUrl ? (
						// biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it
						<img
							src={previewUrl}
							alt={name || "Preview"}
							className="w-full h-full object-contain"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-primary/30 font-heading text-5xl font-bold">
							{name.charAt(0) || "?"}
						</div>
					)}
				</div>
				<div className="p-5 flex flex-col gap-3">
					<h3 className="font-heading text-primary text-lg tracking-wide truncate">
						{name || "Project Name"}
					</h3>
					<span
						className="self-start font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1"
						style={{
							clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							...(variant === "success"
								? { background: "rgba(34,197,94,0.12)", color: "#4ade80" }
								: variant === "gold"
									? { background: "rgba(255,215,0,0.10)", color: "#ffd700" }
									: { background: "rgba(96,165,250,0.12)", color: "#60a5fa" }),
						}}
					>
						{status}
					</span>
					{description && (
						<p className="text-text-gray text-sm leading-relaxed line-clamp-2 font-body">
							{description}
						</p>
					)}
					<div className="flex gap-4 text-xs text-text-gray flex-wrap font-body">
						{dueDate && (
							<span className="flex items-center gap-1.5">
								<Calendar className="w-3 h-3 text-primary" />
								{formatDate(dueDate)}
							</span>
						)}
						{duration && (
							<span className="flex items-center gap-1.5">
								<Clock className="w-3 h-3 text-primary" />
								{duration}
							</span>
						)}
					</div>
					<span className="font-heading text-[9px] text-primary">
						{progress}%
					</span>
				</div>
				<div className="h-[3px] w-full bg-bg-dark">
					<div
						className="h-full transition-all duration-300"
						style={{ width: `${progress}%`, backgroundColor: "#ffd700" }}
					/>
				</div>
			</div>
		</div>
	);
}

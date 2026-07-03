"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamMember } from "@/types/team";

interface MemberModalProps {
	member: TeamMember;
	onClose: () => void;
}

export function MemberModal({ member, onClose }: MemberModalProps) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [imgError, setImgError] = useState(false);

	useEffect(() => {
		dialogRef.current?.showModal();
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose}
			onClick={(e) => {
				if (e.target === dialogRef.current) onClose();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
			className="fixed inset-0 z-50 m-auto bg-bg-panel rounded-sm border border-gray-mid max-w-lg w-full p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm overflow-hidden"
		>
			{/* Racing stripe */}
			<div className="flex h-[3px]">
				<div className="flex-1 bg-primary" />
				<div className="w-12 bg-bg-dark" />
				<div className="w-5 bg-primary" />
			</div>

			<div className="p-8 relative">
				{/* Close button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 w-[26px] h-[26px] rounded-full border border-gray-dark flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-colors"
					aria-label="Close"
				>
					<i className="fas fa-times text-xs" aria-hidden="true" />
				</button>

				{/* Photo + name */}
				<div className="flex gap-5 items-center">
					<div className="relative w-20 h-20 rounded-full overflow-hidden border border-primary/50 shrink-0 bg-primary/20 flex items-center justify-center">
						{imageUrl && !imgError ? (
							<Image
								src={imageUrl}
								alt={member.full_name}
								fill
								sizes="80px"
								className="object-cover"
								onError={() => setImgError(true)}
							/>
						) : (
							<span className="text-primary font-heading text-2xl font-bold">
								{member.full_name.charAt(0)}
							</span>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="font-heading text-lg text-primary">
							{member.full_name}
						</h2>
						<span
							className="inline-flex self-start px-2.5 py-1 font-heading text-[7px] tracking-[2px] uppercase text-primary bg-primary/10"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							}}
						>
							{member.role.replace(/_/g, " ")}
						</span>
					</div>
				</div>

				{/* Gold divider */}
				<div
					className="h-px mt-6 mb-6"
					style={{
						background: "linear-gradient(90deg, #ffd700, rgba(255,215,0,0.1))",
					}}
				/>

				{/* Detail rows */}
				<div className="flex flex-col gap-4">
					{member.department_name && (
						<div className="flex items-center gap-4">
							<div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
								<i
									className="fas fa-sitemap text-primary text-xs"
									aria-hidden="true"
								/>
							</div>
							<div>
								<p className="font-heading text-[7px] tracking-[2px] uppercase text-text-gray mb-0.5">
									Department
								</p>
								<p className="font-body text-sm text-text-light">
									{member.department_name}
								</p>
							</div>
						</div>
					)}
					{member.faculty && (
						<div className="flex items-center gap-4">
							<div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
								<i
									className="fas fa-university text-primary text-xs"
									aria-hidden="true"
								/>
							</div>
							<div>
								<p className="font-heading text-[7px] tracking-[2px] uppercase text-text-gray mb-0.5">
									Faculty
								</p>
								<p className="font-body text-sm text-text-light">
									{member.faculty}
								</p>
							</div>
						</div>
					)}
					{member.study_field && (
						<div className="flex items-center gap-4">
							<div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
								<i
									className="fas fa-graduation-cap text-primary text-xs"
									aria-hidden="true"
								/>
							</div>
							<div>
								<p className="font-heading text-[7px] tracking-[2px] uppercase text-text-gray mb-0.5">
									Study Field
								</p>
								<p className="font-body text-sm text-text-light">
									{member.study_field}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</dialog>
	);
}

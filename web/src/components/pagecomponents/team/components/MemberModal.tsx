import Image from "next/image";
import { useEffect, useRef } from "react";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamMember } from "@/types/team";

interface MemberModalProps {
	member: TeamMember;
	onClose: () => void;
}

export function MemberModal({ member, onClose }: MemberModalProps) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const dialogRef = useRef<HTMLDialogElement>(null);

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
			className="fixed inset-0 z-50 m-auto bg-bg-panel rounded-2xl border border-gray-mid max-w-lg w-full p-8 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute top-4 right-4 text-text-gray hover:text-primary transition-colors"
				aria-label="Close"
			>
				<i className="fas fa-times text-xl" aria-hidden="true" />
			</button>

			<div className="flex gap-6 items-start">
				<div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 shrink-0">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={member.full_name}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-heading text-3xl font-bold">
							{member.full_name.charAt(0)}
						</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<h2 className="font-heading text-xl text-primary">
						{member.full_name}
					</h2>
					<p className="text-text-gray text-sm capitalize">
						{member.role.replace(/_/g, " ")}
					</p>
				</div>
			</div>

			<div className="mt-6 flex flex-col gap-3">
				{member.department && (
					<div className="flex items-center gap-3 text-sm text-text-gray">
						<i className="fas fa-sitemap text-primary w-4" aria-hidden="true" />
						{member.department}
					</div>
				)}
				{member.faculty && (
					<div className="flex items-center gap-3 text-sm text-text-gray">
						<i
							className="fas fa-university text-primary w-4"
							aria-hidden="true"
						/>
						{member.faculty}
					</div>
				)}
				{member.study_field && (
					<div className="flex items-center gap-3 text-sm text-text-gray">
						<i
							className="fas fa-graduation-cap text-primary w-4"
							aria-hidden="true"
						/>
						{member.study_field}
					</div>
				)}
				{member.email && (
					<div className="flex items-center gap-3 text-sm text-text-gray">
						<i
							className="fas fa-envelope text-primary w-4"
							aria-hidden="true"
						/>
						<a
							href={`mailto:${member.email}`}
							className="hover:text-primary transition-colors"
						>
							{member.email}
						</a>
					</div>
				)}
			</div>
		</dialog>
	);
}

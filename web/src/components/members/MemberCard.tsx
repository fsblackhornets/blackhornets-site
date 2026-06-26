"use client";

import { useState } from "react";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamMember } from "@/types/team";

interface MemberCardProps {
	member: TeamMember;
	position?: string;
	onClick: (member: TeamMember) => void;
	size?: "md" | "lg";
}

export function MemberCard({ member, position, onClick, size = "md" }: MemberCardProps) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);
	const label = position ?? member.role?.replace(/_/g, " ");

	const isLg = size === "lg";

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className={`flex flex-col items-center gap-3 bg-bg-panel rounded-2xl border border-primary/40 p-5 hover:border-primary transition-colors cursor-pointer ${isLg ? "w-52" : "w-44"}`}
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className={`rounded-full overflow-hidden border-2 border-primary/50 shrink-0 bg-primary/20 flex items-center justify-center ${isLg ? "w-32 h-32" : "w-24 h-24"}`}>
				{imageUrl && !imgError ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={imageUrl}
						alt={member.full_name}
						className="w-full h-full object-cover"
						onError={() => setImgError(true)}
					/>
				) : (
					<span className={`text-primary font-heading font-bold ${isLg ? "text-4xl" : "text-3xl"}`}>
						{member.full_name.charAt(0)}
					</span>
				)}
			</div>
			<div className="text-center">
				<p className={`text-text-light font-semibold leading-tight ${isLg ? "text-base" : "text-sm"}`}>
					{member.full_name}
				</p>
				{label && (
					<p className={`text-primary font-heading tracking-wider mt-1 capitalize ${isLg ? "text-sm" : "text-xs"}`}>
						{label}
					</p>
				)}
			</div>
		</button>
	);
}

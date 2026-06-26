"use client";

import { useState } from "react";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamMember } from "@/types/team";

interface MemberCardProps {
	member: TeamMember;
	position?: string;
	onClick: (member: TeamMember) => void;
}

export function MemberCard({ member, position, onClick }: MemberCardProps) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);
	const label = position ?? member.role?.replace(/_/g, " ");

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="flex flex-col items-center gap-3 bg-bg-panel rounded-2xl border border-primary/30 p-5 hover:border-primary transition-colors cursor-pointer w-44"
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 shrink-0 bg-primary/20 flex items-center justify-center">
				{imageUrl && !imgError ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={imageUrl}
						alt={member.full_name}
						className="w-full h-full object-cover"
						onError={() => setImgError(true)}
					/>
				) : (
					<span className="text-primary font-heading text-3xl font-bold">
						{member.full_name.charAt(0)}
					</span>
				)}
			</div>
			<div className="text-center">
				<p className="text-text-light text-sm font-semibold leading-tight">
					{member.full_name}
				</p>
				{label && (
					<p className="text-primary text-xs font-heading tracking-wider mt-1 capitalize">
						{label}
					</p>
				)}
			</div>
		</button>
	);
}

import Image from "next/image";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamMember } from "@/types/team";

interface MemberCardProps {
	member: TeamMember;
	onClick: (member: TeamMember) => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="group member-card-wrapper h-56 cursor-pointer w-full"
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className="member-card-inner h-full">
				{/* Front */}
				<div className="member-card-front bg-bg-panel border border-gray-mid flex flex-col items-center justify-center gap-3 p-4">
					<div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40">
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt={member.full_name}
								fill
								sizes="64px"
								className="object-cover"
							/>
						) : (
							<div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-heading text-xl font-bold">
								{member.full_name.charAt(0)}
							</div>
						)}
					</div>
					<div className="text-center">
						<p className="text-text-light text-sm font-semibold leading-tight">
							{member.full_name}
						</p>
						{member.department && (
							<p className="text-primary text-xs font-heading tracking-wider mt-1">
								{member.department}
							</p>
						)}
					</div>
				</div>

				{/* Back */}
				<div className="member-card-back bg-bg-dark border border-primary/30 flex flex-col justify-center gap-3 p-4">
					{member.faculty && (
						<div className="text-xs text-text-gray">
							<i
								className="fas fa-university text-primary mr-1"
								aria-hidden="true"
							/>
							{member.faculty}
						</div>
					)}
					{member.study_field && (
						<div className="text-xs text-text-gray">
							<i
								className="fas fa-graduation-cap text-primary mr-1"
								aria-hidden="true"
							/>
							{member.study_field}
						</div>
					)}
					{member.department && (
						<div className="text-xs text-text-gray">
							<i
								className="fas fa-sitemap text-primary mr-1"
								aria-hidden="true"
							/>
							{member.department}
						</div>
					)}
					<p className="text-primary text-xs font-heading tracking-wider mt-2 text-center">
						Click for details
					</p>
				</div>
			</div>
		</button>
	);
}

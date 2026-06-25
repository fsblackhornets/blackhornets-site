import Image from "next/image";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamMember } from "@/types/team";

interface LeaderCardProps {
	member: TeamMember;
	position: string;
	onClick: (member: TeamMember) => void;
}

export function LeaderCard({ member, position, onClick }: LeaderCardProps) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="flex flex-col items-center gap-3 bg-bg-panel rounded-xl border border-primary/30 p-5 hover:border-primary transition-colors cursor-pointer w-40"
		>
			<div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={member.full_name}
						fill
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-heading text-2xl font-bold">
						{member.full_name.charAt(0)}
					</div>
				)}
			</div>
			<div className="text-center">
				<p className="text-text-light text-sm font-semibold leading-tight">
					{member.full_name}
				</p>
				<p className="text-primary text-xs font-heading tracking-wider mt-1">
					{position}
				</p>
			</div>
		</button>
	);
}

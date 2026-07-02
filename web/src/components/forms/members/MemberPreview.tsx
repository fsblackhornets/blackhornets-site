"use client";

interface MemberPreviewProps {
	fullName: string;
	role: string;
	position: string;
	imagePreviewUrl: string | null;
}

/** Mirrors the two ways a member actually renders on /team: sub_leader uses
 * MemberCard (lg), everything else uses the plain CompactMemberCard. */
export function MemberPreview({
	fullName,
	role,
	position,
	imagePreviewUrl,
}: MemberPreviewProps) {
	const isSubLeader = role === "sub_leader";
	const initial = fullName.charAt(0).toUpperCase() || "?";

	return (
		<div>
			<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-3">
				Live Preview
			</p>
			{isSubLeader ? (
				<div className="flex flex-col items-center gap-3 bg-bg-panel rounded-sm border border-primary p-5 w-52">
					<div className="rounded-full overflow-hidden border border-primary/30 shrink-0 bg-primary/20 flex items-center justify-center w-32 h-32">
						{imagePreviewUrl ? (
							// biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it
							<img
								src={imagePreviewUrl}
								alt={fullName || "Preview"}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-primary font-heading font-bold text-4xl">
								{initial}
							</span>
						)}
					</div>
					<div className="text-center">
						<p className="text-text-light font-body font-semibold leading-tight text-base">
							{fullName || "Member Name"}
						</p>
						<p className="font-heading text-[10px] tracking-[2px] uppercase text-primary/50 mt-1 capitalize">
							{position || "Sub Leader"}
						</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center gap-3 bg-[#0f0f0f] border border-[#1c1c1c] rounded-sm p-4 w-[156px] justify-center">
					<div className="w-24 h-24 rounded-full border border-primary/20 bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
						{imagePreviewUrl ? (
							// biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it
							<img
								src={imagePreviewUrl}
								alt={fullName || "Preview"}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-primary font-heading text-3xl font-bold">
								{initial}
							</span>
						)}
					</div>
					<p className="font-body text-text-light text-xs text-center leading-tight">
						{fullName || "Member Name"}
					</p>
				</div>
			)}
			<p className="font-body text-[8px] text-[#333] mt-2">
				{isSubLeader
					? "Shown as a sub leader card"
					: "Shown as a compact roster card"}
			</p>
		</div>
	);
}

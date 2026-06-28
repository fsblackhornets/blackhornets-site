"use client";

import { useState } from "react";
import { MemberCard } from "@/components/members/MemberCard";
import { useTeamState } from "@/hooks/team/useTeamState";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamData, TeamMember } from "@/types/team";
import { MemberModal } from "./components/MemberModal";
import { TEAM_STRUCTURE, type TeamKey } from "./constants";

// ── sub-components ───────────────────────────────────────────

function LeaderHeroCard({
	member,
	onClick,
}: {
	member: TeamMember;
	onClick: (m: TeamMember) => void;
}) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="w-full bg-bg-dark border border-gray-dark border-l-[3px] border-l-primary rounded-sm p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-primary/70 transition-colors duration-300 text-left relative overflow-hidden"
			aria-label={`View ${member.full_name}'s profile`}
		>
			{/* "01" watermark */}
			<span
				className="absolute right-4 top-1/2 -translate-y-1/2 font-heading font-black text-white text-[80px] leading-none pointer-events-none select-none"
				style={{ opacity: 0.025 }}
				aria-hidden="true"
			>
				01
			</span>

			{/* Photo */}
			<div className="relative shrink-0">
				<div className="w-24 h-24 rounded-full border border-primary/60 overflow-hidden bg-primary/20 flex items-center justify-center">
					{imageUrl && !imgError ? (
						// biome-ignore lint/performance/noImgElement: onError handler required
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
				{/* Gold checkmark badge */}
				<div className="absolute bottom-0 right-0 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center">
					<i
						className="fas fa-check text-black"
						style={{ fontSize: "7px" }}
						aria-hidden="true"
					/>
				</div>
			</div>

			{/* Info */}
			<div className="flex flex-col gap-1 relative z-10">
				<p className="font-heading text-[7px] tracking-[4px] uppercase text-primary/50">
					Project Leader
				</p>
				<h3 className="font-heading text-xl text-primary tracking-wide">
					{member.full_name}
				</h3>
				{member.study_field && (
					<p className="text-text-gray text-sm mt-1">{member.study_field}</p>
				)}
				{member.faculty && (
					<p className="text-text-gray text-xs opacity-70">{member.faculty}</p>
				)}
				<p className="font-heading text-[8px] tracking-[2px] uppercase text-primary/50 mt-3">
					View Profile ›
				</p>
			</div>
		</button>
	);
}

function MiniLeaderCard({
	member,
	onClick,
}: {
	member: TeamMember;
	onClick: (m: TeamMember) => void;
}) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="w-full bg-bg-dark border border-[#1e1e1e] rounded-sm p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className="w-12 h-12 rounded-full border border-primary/30 bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
				{imageUrl && !imgError ? (
					// biome-ignore lint/performance/noImgElement: onError handler required
					<img
						src={imageUrl}
						alt={member.full_name}
						className="w-full h-full object-cover"
						onError={() => setImgError(true)}
					/>
				) : (
					<span className="text-primary font-heading text-xl font-bold">
						{member.full_name.charAt(0)}
					</span>
				)}
			</div>
			<div className="text-center">
				<p className="font-body text-text-light text-xs font-semibold leading-tight">
					{member.full_name}
				</p>
				<p className="font-heading text-[6px] tracking-[2px] uppercase text-primary/50 mt-0.5">
					Dept. Leader
				</p>
			</div>
		</button>
	);
}

function CompactMemberCard({
	member,
	onClick,
}: {
	member: TeamMember;
	onClick: (m: TeamMember) => void;
}) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-sm p-3 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-colors"
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
				{imageUrl && !imgError ? (
					// biome-ignore lint/performance/noImgElement: onError handler required
					<img
						src={imageUrl}
						alt={member.full_name}
						className="w-full h-full object-cover"
						onError={() => setImgError(true)}
					/>
				) : (
					<span className="text-primary font-heading text-sm font-bold">
						{member.full_name.charAt(0)}
					</span>
				)}
			</div>
			<p className="font-body text-text-light text-[7.5px] text-center leading-tight">
				{member.full_name}
			</p>
		</button>
	);
}

// ── main ────────────────────────────────────────────────────

export function TeamPageClient({ data }: { data: TeamData }) {
	const {
		selectedTeam,
		selectedDepartment,
		selectedMember,
		filteredMembers,
		selectTeam,
		goBack,
		openMember,
		closeMember,
	} = useTeamState(data);

	const sectors = Object.entries(TEAM_STRUCTURE) as [
		TeamKey,
		(typeof TEAM_STRUCTURE)[TeamKey],
	][];

	return (
		<>
			<section className="py-16 px-4">
				<div className="max-w-screen-2xl mx-auto">
					{/* Project Leader */}
					{data.team_leader && (
						<div className="mb-10 max-w-3xl mx-auto">
							<LeaderHeroCard member={data.team_leader} onClick={openMember} />
						</div>
					)}

					{/* Sector overview */}
					{!selectedTeam && (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							{sectors.map(([key, info], i) => {
								const pl =
									key === "mechanical"
										? data.mechanical_project_leader
										: key === "electrical"
											? data.electrical_project_leader
											: data.business_project_leader;

								return (
									<div
										key={key}
										className="flex flex-col gap-4 rounded-sm p-6"
										style={{
											background: "#1a1a1a",
											border: "1px solid #222",
											borderTop:
												i === 0
													? "2px solid #ffd700"
													: "2px solid rgba(255,215,0,0.5)",
										}}
									>
										<h3 className="font-heading text-[9px] tracking-[2px] uppercase text-primary text-center">
											{info.name}
										</h3>

										{pl && <MiniLeaderCard member={pl} onClick={openMember} />}

										<div className="flex flex-col gap-2 items-center">
											{info.departments.map((dept) => (
												<button
													key={`${key}-${dept}`}
													type="button"
													onClick={() => selectTeam(key, dept)}
													className="w-full font-heading text-[7.5px] tracking-[1px] py-1 px-2.5 text-[#888] hover:text-primary transition-colors"
													style={{
														clipPath:
															"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
														border: "1px solid #2a2a2a",
													}}
												>
													{dept}
												</button>
											))}
										</div>

										<button
											type="button"
											onClick={() => selectTeam(key)}
											className="mt-auto font-heading text-[8px] tracking-[2px] uppercase py-2.5 px-4 transition-colors duration-300"
											style={
												i === 0
													? {
															clipPath:
																"polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
															background: "#ffd700",
															color: "#000",
														}
													: {
															clipPath:
																"polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
															border: "1px solid #ffd700",
															color: "#ffd700",
															background: "transparent",
														}
											}
										>
											See Team Members
										</button>
									</div>
								);
							})}
						</div>
					)}

					{/* Drill-down view */}
					{selectedTeam && (
						<div>
							{/* Breadcrumb */}
							<div className="flex items-center gap-2 font-body text-xs text-text-gray mb-8 flex-wrap">
								<button
									type="button"
									onClick={goBack}
									className="font-heading text-primary text-[9px] tracking-[2px] uppercase flex items-center gap-1.5 hover:underline"
								>
									<i className="fas fa-arrow-left" aria-hidden="true" />
									Back to Teams
								</button>
								<span className="text-text-gray/40">›</span>
								<span>Our Team</span>
								<span className="text-text-gray/40">›</span>
								<span className="text-primary">
									{TEAM_STRUCTURE[selectedTeam].name}
								</span>
							</div>

							{/* Section header */}
							<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
								{/* Sector heading */}
								<div>
									<span className="font-heading text-[8px] tracking-[3px] uppercase text-text-gray block mb-1">
										Sector
									</span>
									<h2 className="font-heading font-black text-white leading-tight text-2xl">
										{(() => {
											const name = TEAM_STRUCTURE[selectedTeam].name;
											if (name.includes("Engineering")) {
												const idx = name.indexOf("Engineering");
												return (
													<>
														{name.slice(0, idx)}
														<span
															style={{
																background:
																	"linear-gradient(90deg, #ffd700, #ffc107)",
																WebkitBackgroundClip: "text",
																WebkitTextFillColor: "transparent",
																backgroundClip: "text",
															}}
														>
															Engineering
														</span>
													</>
												);
											}
											return name;
										})()}
									</h2>
								</div>

								{/* Department filter chips */}
								{TEAM_STRUCTURE[selectedTeam].departments.length > 1 && (
									<div className="flex gap-2 flex-wrap">
										<button
											type="button"
											onClick={() => selectTeam(selectedTeam)}
											className="font-heading text-[7.5px] tracking-[2px] uppercase px-3 py-1.5 transition-colors duration-200"
											style={{
												clipPath:
													"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
												border: !selectedDepartment
													? "1px solid #ffd700"
													: "1px solid #2a2a2a",
												background: !selectedDepartment
													? "rgba(255,215,0,0.1)"
													: "transparent",
												color: !selectedDepartment ? "#ffd700" : "#555",
											}}
										>
											All
										</button>
										{TEAM_STRUCTURE[selectedTeam].departments.map((dept) => (
											<button
												key={dept}
												type="button"
												onClick={() => selectTeam(selectedTeam, dept)}
												className="font-heading text-[7.5px] tracking-[2px] uppercase px-3 py-1.5 transition-colors duration-200"
												style={{
													clipPath:
														"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
													border:
														selectedDepartment === dept
															? "1px solid #ffd700"
															: "1px solid #2a2a2a",
													background:
														selectedDepartment === dept
															? "rgba(255,215,0,0.1)"
															: "transparent",
													color:
														selectedDepartment === dept ? "#ffd700" : "#555",
												}}
											>
												{dept}
											</button>
										))}
									</div>
								)}
							</div>

							{/* Dept project leader */}
							{(() => {
								const pl =
									selectedTeam === "mechanical"
										? data.mechanical_project_leader
										: selectedTeam === "electrical"
											? data.electrical_project_leader
											: data.business_project_leader;
								return pl ? (
									<div className="mb-10">
										<p className="font-heading text-[8px] tracking-[3px] uppercase text-primary/60 text-center mb-4">
											Department Leader
										</p>
										<div className="flex justify-center">
											<MemberCard
												member={pl}
												position="Department Leader"
												onClick={openMember}
												size="lg"
											/>
										</div>
									</div>
								) : null;
							})()}

							{/* Members */}
							{filteredMembers.length === 0 ? (
								<p className="text-center text-text-gray py-12">
									No members found.
								</p>
							) : (
								(() => {
									const subLeaders = filteredMembers.filter(
										(m) => m.role === "sub_leader",
									);
									const members = filteredMembers.filter(
										(m) => m.role !== "sub_leader",
									);
									return (
										<>
											{subLeaders.length > 0 && (
												<div className="mb-8">
													<div className="flex items-center gap-4 mb-6">
														<div className="flex-1 h-px bg-primary/40" />
														<span className="font-heading text-[8px] tracking-[4px] text-primary/40 uppercase">
															Team Leaders
														</span>
														<div className="flex-1 h-px bg-primary/40" />
													</div>
													<div className="flex flex-wrap gap-4 justify-center">
														{subLeaders.map((member) => (
															<MemberCard
																key={member.id}
																member={member}
																position="Team Leader"
																onClick={openMember}
																size="lg"
															/>
														))}
													</div>
												</div>
											)}

											{members.length > 0 && (
												<>
													<div className="flex items-center gap-4 my-6">
														<div
															className="flex-1 h-px"
															style={{ background: "#222" }}
														/>
														<span
															className="font-heading text-[8px] tracking-[4px] uppercase"
															style={{ color: "#333" }}
														>
															Members
														</span>
														<div
															className="flex-1 h-px"
															style={{ background: "#222" }}
														/>
													</div>
													<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
														{members.map((member) => (
															<CompactMemberCard
																key={member.id}
																member={member}
																onClick={openMember}
															/>
														))}
													</div>
												</>
											)}
										</>
									);
								})()
							)}
						</div>
					)}
				</div>
			</section>

			{selectedMember && (
				<MemberModal member={selectedMember} onClose={closeMember} />
			)}
		</>
	);
}

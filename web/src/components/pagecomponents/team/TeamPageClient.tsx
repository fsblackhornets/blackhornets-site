"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MemberCard } from "@/components/members/MemberCard";
import { TEAM_STRUCTURE, type TeamKey } from "@/constants/team";
import { useTeamState } from "@/hooks/team/useTeamState";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { TeamData, TeamMember } from "@/types/team";
import { MemberModal } from "./components/MemberModal";

// ── sub-components ───────────────────────────────────────────

function LeaderHeroCard({
	member,
	onClick,
	labels,
}: {
	member: TeamMember;
	onClick: (m: TeamMember) => void;
	labels: { projectLeader: string; viewProfile: string };
}) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="w-full bg-bg-dark border border-primary rounded-sm p-8 flex flex-col gap-6 items-center justify-center hover:border-primary/70 transition-colors duration-300 text-left relative overflow-hidden"
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
				<div className="relative w-36 h-36 rounded-full border border-primary/60 overflow-hidden bg-primary/20 flex items-center justify-center">
					{imageUrl && !imgError ? (
						<Image
							src={imageUrl}
							alt={member.full_name}
							fill
							sizes="144px"
							className="object-cover"
							style={{ objectPosition: member.image_position || "50% 50%" }}
							onError={() => setImgError(true)}
						/>
					) : (
						<span className="text-primary font-heading text-5xl font-bold">
							{member.full_name.charAt(0)}
						</span>
					)}
				</div>
				{/* Gold checkmark badge */}
				<div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
					<i
						className="fas fa-check text-black"
						style={{ fontSize: "10px" }}
						aria-hidden="true"
					/>
				</div>
			</div>

			{/* Info */}
			<div className="flex flex-col items-center gap-1 relative z-10 text-center">
				<p className="font-heading text-xs tracking-[4px] uppercase text-primary/50">
					{labels.projectLeader}
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
					{labels.viewProfile}
				</p>
			</div>
		</button>
	);
}

function MiniLeaderCard({
	member,
	onClick,
	deptLeader,
}: {
	member: TeamMember;
	onClick: (m: TeamMember) => void;
	deptLeader: string;
}) {
	const imageUrl = buildProfileImageUrl(member.profile_picture);
	const [imgError, setImgError] = useState(false);

	return (
		<button
			type="button"
			onClick={() => onClick(member)}
			className="w-full max-w-[260px] mx-auto bg-bg-dark border border-primary rounded-sm p-6 flex flex-col items-center gap-4 hover:border-primary/70 transition-colors duration-300"
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className="relative shrink-0">
				<div className="relative w-28 h-28 rounded-full border border-primary/60 overflow-hidden bg-primary/20 flex items-center justify-center">
					{imageUrl && !imgError ? (
						<Image
							src={imageUrl}
							alt={member.full_name}
							fill
							sizes="112px"
							className="object-cover"
							style={{ objectPosition: member.image_position || "50% 50%" }}
							onError={() => setImgError(true)}
						/>
					) : (
						<span className="text-primary font-heading text-4xl font-bold">
							{member.full_name.charAt(0)}
						</span>
					)}
				</div>
				{/* Gold checkmark badge */}
				<div className="absolute bottom-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center">
					<i
						className="fas fa-check text-black"
						style={{ fontSize: "8px" }}
						aria-hidden="true"
					/>
				</div>
			</div>
			<div className="flex flex-col items-center gap-1 text-center w-full">
				<h3 className="font-heading text-base text-primary tracking-wide truncate w-full">
					{member.full_name}
				</h3>
				<p className="font-heading text-[10px] tracking-[3px] uppercase text-primary/50">
					{deptLeader}
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
			className="w-[156px] bg-[#0f0f0f] border border-[#1c1c1c] rounded-sm p-4 flex flex-col items-center gap-3 hover:border-primary/30 transition-colors justify-center"
			aria-label={`View ${member.full_name}'s profile`}
		>
			<div className="relative w-24 h-24 rounded-full border border-primary/20 bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
				{imageUrl && !imgError ? (
					<Image
						src={imageUrl}
						alt={member.full_name}
						fill
						sizes="96px"
						className="object-cover"
						style={{ objectPosition: member.image_position || "50% 50%" }}
						onError={() => setImgError(true)}
					/>
				) : (
					<span className="text-primary font-heading text-3xl font-bold">
						{member.full_name.charAt(0)}
					</span>
				)}
			</div>
			<p className="font-body text-text-light text-xs text-center leading-tight">
				{member.full_name}
			</p>
		</button>
	);
}

// ── main ────────────────────────────────────────────────────

export function TeamPageClient({ data }: { data: TeamData }) {
	const t = useTranslations("team");
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

	const leaderLabels = {
		projectLeader: t("projectLeader"),
		viewProfile: t("viewProfile"),
	};

	return (
		<>
			<section className="py-16 px-4">
				<div className="max-w-screen-2xl mx-auto">
					{/* Project Leader */}
					{data.team_leader && (
						<div className="mb-10 max-w-xs mx-auto">
							<LeaderHeroCard
								member={data.team_leader}
								onClick={openMember}
								labels={leaderLabels}
							/>
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
										<h3 className="font-heading text-lg font-black tracking-[2px] uppercase text-primary text-center">
											{info.name}
										</h3>

										{pl && (
											<MiniLeaderCard
												member={pl}
												onClick={openMember}
												deptLeader={t("deptLeader")}
											/>
										)}

										<div className="flex flex-col gap-2 items-center">
											{info.departments.map((dept) => (
												<button
													key={`${key}-${dept}`}
													type="button"
													onClick={() => selectTeam(key, dept)}
													className="w-full font-heading text-xs font-semibold tracking-[1.5px] py-2.5 px-3 text-[#aaa] hover:text-primary hover:border-primary/60 transition-colors"
													style={{
														clipPath:
															"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
														border: "1px solid #3a3a3a",
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
											{t("seeTeamMembers")}
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
									{t("backToTeams")}
								</button>
								<span className="text-text-gray/40">›</span>
								<span>{t("ourTeam")}</span>
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
										{t("sector")}
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
											className="font-heading text-xs font-semibold tracking-[2px] uppercase px-4 py-2 transition-colors duration-200"
											style={{
												clipPath:
													"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
												border: !selectedDepartment
													? "1px solid #ffd700"
													: "1px solid #2a2a2a",
												background: !selectedDepartment
													? "rgba(255,215,0,0.1)"
													: "transparent",
												color: !selectedDepartment ? "#ffd700" : "#999",
											}}
										>
											{t("all")}
										</button>
										{TEAM_STRUCTURE[selectedTeam].departments.map((dept) => (
											<button
												key={dept}
												type="button"
												onClick={() => selectTeam(selectedTeam, dept)}
												className="font-heading text-xs font-semibold tracking-[2px] uppercase px-4 py-2 transition-colors duration-200"
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
														selectedDepartment === dept ? "#ffd700" : "#999",
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
										<p className="font-heading text-sm tracking-[3px] uppercase text-primary/60 text-center mb-4">
											{t("departmentLeader")}
										</p>
										<div className="flex justify-center">
											<MemberCard
												member={pl}
												position={t("departmentLeader")}
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
									{t("noMembersFound")}
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
														<span className="font-heading text-sm tracking-[4px] text-primary/40 uppercase">
															{t("teamLeaders")}
														</span>
														<div className="flex-1 h-px bg-primary/40" />
													</div>
													<div className="flex flex-wrap gap-4 justify-center">
														{subLeaders.map((member) => (
															<MemberCard
																key={member.id}
																member={member}
																position={t("teamLeaders")}
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
														<div className="flex-1 h-px bg-primary/40" />
														<span className="font-heading text-sm tracking-[4px] uppercase text-primary/40">
															{t("members")}
														</span>
														<div className="flex-1 h-px bg-primary/40" />
													</div>
													<div className="flex flex-wrap justify-center gap-3">
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

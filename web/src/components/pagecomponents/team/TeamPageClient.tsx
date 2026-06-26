"use client";

import { useState } from "react";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import { useTeamState } from "@/hooks/team/useTeamState";
import { MemberCard } from "@/components/members/MemberCard";
import type { TeamData, TeamMember } from "@/types/team";
import { MemberModal } from "./components/MemberModal";
import { TEAM_STRUCTURE, type TeamKey } from "./constants";

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
			className="w-full bg-bg-panel rounded-2xl border border-primary/50 p-8 flex flex-col sm:flex-row gap-8 items-center justify-center hover:border-primary transition-colors duration-300 text-left"
			aria-label={`View ${member.full_name}'s profile`}
		>
			{/* Photo */}
			<div className="w-36 h-36 rounded-full border-2 border-primary/60 overflow-hidden shrink-0 bg-primary/20 flex items-center justify-center">
				{imageUrl && !imgError ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={imageUrl}
						alt={member.full_name}
						className="w-full h-full object-cover"
						onError={() => setImgError(true)}
					/>
				) : (
					<span className="text-primary font-heading text-5xl font-bold">
						{member.full_name.charAt(0)}
					</span>
				)}
			</div>

			{/* Info */}
			<div>
				<p className="font-heading text-xs tracking-[4px] text-primary/60 uppercase mb-2">
					Project Leader
				</p>
				<h3 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] text-primary font-bold">
					{member.full_name}
				</h3>
				{member.study_field && (
					<p className="text-text-gray text-sm mt-2 tracking-wide">
						{member.study_field}
					</p>
				)}
				{member.faculty && (
					<p className="text-text-gray/70 text-xs mt-1">{member.faculty}</p>
				)}
				<p className="text-primary/50 text-xs font-heading tracking-widest mt-4 uppercase">
					Click to view profile →
				</p>
			</div>
		</button>
	);
}

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

	return (
		<>
			{/* Leadership */}
			<section className="py-16 px-4">
				<div className="max-w-screen-2xl mx-auto">
					<h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] uppercase tracking-[3px] text-center bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent mb-12">
						Team Leadership
					</h2>

					{/* Team Leader — big horizontal card */}
					{data.team_leader && (
						<div className="mb-12 max-w-3xl mx-auto">
							<LeaderHeroCard member={data.team_leader} onClick={openMember} />
						</div>
					)}

					{/* Sectors */}
					{!selectedTeam && (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{(
								Object.entries(TEAM_STRUCTURE) as [
									TeamKey,
									(typeof TEAM_STRUCTURE)[TeamKey],
								][]
							).map(([key, info]) => {
								const pl =
									key === "mechanical"
										? data.mechanical_project_leader
										: key === "electrical"
											? data.electrical_project_leader
											: data.business_project_leader;

								return (
									<div
										key={key}
										className={`bg-bg-panel rounded-2xl border p-6 flex flex-col gap-4 transition-colors ${info.accent}`}
									>
										<h3 className="font-heading text-primary text-base font-bold tracking-wider uppercase text-center whitespace-nowrap">
											{info.name}
										</h3>

										{pl && (
											<div className="flex justify-center">
												<MemberCard
													member={pl}
													position="Department Leader"
													onClick={openMember}
												/>
											</div>
										)}

										<div className="flex flex-col gap-2 items-center">
											{info.departments.map((dept) => (
												<button
													key={`${key}-${dept}`}
													type="button"
													onClick={() => selectTeam(key, dept)}
													className="text-xs px-3 py-1 rounded-full border border-gray-mid text-text-gray hover:border-primary hover:text-primary transition-colors"
												>
													{dept}
												</button>
											))}
										</div>

										<button
											type="button"
											onClick={() => selectTeam(key)}
											className="mt-auto text-sm font-heading tracking-widest text-primary border border-primary rounded-lg py-2 hover:bg-primary hover:text-bg-dark transition-colors"
										>
											See Team Members
										</button>
									</div>
								);
							})}
						</div>
					)}

					{/* Members view */}
					{selectedTeam && (
						<div>
							<div className="mb-8">
								<button
									type="button"
									onClick={goBack}
									className="flex items-center gap-2 text-primary hover:underline font-heading text-sm tracking-widest ml-2"
								>
									<i className="fas fa-arrow-left" aria-hidden="true" />
									Back to Teams
								</button>
								<h3 className="font-heading text-primary tracking-widest font-bold mt-3 ml-2">
									{TEAM_STRUCTURE[selectedTeam].name}
									{selectedDepartment && ` — ${selectedDepartment}`}
								</h3>
							</div>

							{(() => {
								const pl = selectedTeam === "mechanical"
									? data.mechanical_project_leader
									: selectedTeam === "electrical"
										? data.electrical_project_leader
										: data.business_project_leader;
								return pl ? (
									<div className="mb-8">
										<p className="font-heading text-xs tracking-[4px] text-primary/60 uppercase mb-4 text-center">
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

							{filteredMembers.length === 0 ? (
								<p className="text-center text-text-gray py-12">
									No members found.
								</p>
							) : (() => {
								const subLeaders = filteredMembers.filter((m) => m.role === "sub_leader");
								const members = filteredMembers.filter((m) => m.role !== "sub_leader");
								return (
									<>
										{subLeaders.length > 0 && (
											<div className="mb-8">
												<p className="font-heading text-xs tracking-[4px] text-primary/60 uppercase mb-4 text-center">
													Team Leader
												</p>
												<div className="flex flex-wrap gap-4 justify-center">
													{subLeaders.map((member, i) => (
														<MemberCard
															key={`sub-${member.id}-${i}`}
															member={member}
															position="Team Leader"
															onClick={openMember}
															size="lg"
														/>
													))}
												</div>
											</div>
										)}
										{subLeaders.length > 0 && members.length > 0 && (
											<div className="flex items-center gap-4 my-6">
												<div className="flex-1 h-px bg-primary/40" />
												<span className="font-heading text-xs tracking-[4px] text-primary/40 uppercase">Members</span>
												<div className="flex-1 h-px bg-primary/40" />
											</div>
										)}
										{members.length > 0 && (
											<div className="flex flex-wrap justify-center gap-4">
												{members.map((member, i) => (
													<MemberCard
														key={`${member.id}-${i}`}
														member={member}
														onClick={openMember}
													/>
												))}
											</div>
										)}
									</>
								);
							})()}

						{/* Department quick-nav */}
						{TEAM_STRUCTURE[selectedTeam].departments.length > 1 && (
							<div className="mt-12 pt-8 border-t border-gray-mid">
								<p className="font-heading text-xs tracking-[4px] text-primary/50 uppercase mb-4 text-center">
									Other Departments
								</p>
								<div className="flex flex-wrap gap-2 justify-center">
									<button
										type="button"
										onClick={() => selectTeam(selectedTeam)}
										className={`text-xs px-4 py-2 rounded-full border transition-colors font-heading tracking-wider ${
											!selectedDepartment
												? "border-primary bg-primary/10 text-primary"
												: "border-gray-mid text-text-gray hover:border-primary hover:text-primary"
										}`}
									>
										All
									</button>
									{TEAM_STRUCTURE[selectedTeam].departments.map((dept) => (
										<button
											key={dept}
											type="button"
											onClick={() => selectTeam(selectedTeam, dept)}
											className={`text-xs px-4 py-2 rounded-full border transition-colors font-heading tracking-wider ${
												selectedDepartment === dept
													? "border-primary bg-primary/10 text-primary"
													: "border-gray-mid text-text-gray hover:border-primary hover:text-primary"
											}`}
										>
											{dept}
										</button>
									))}
								</div>
							</div>
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

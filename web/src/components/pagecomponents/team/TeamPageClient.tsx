"use client";

import { MemberCard } from "@/components/members/MemberCard";
import { useTeamState } from "@/hooks/team/useTeamState";
import type { TeamData } from "@/types/team";
import { MemberModal } from "./components/MemberModal";
import { TEAM_STRUCTURE, type TeamKey } from "./constants";

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
				<div className="max-w-[900px] mx-auto">
					<h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] uppercase tracking-[3px] text-center bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent mb-12">
						Team Leadership
					</h2>

					{/* Team Leader */}
					{data.team_leader && (
						<div className="flex justify-center mb-10">
							<MemberCard
								member={data.team_leader}
								position="Team Leader"
								onClick={openMember}
							/>
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
										<h3 className="font-heading text-primary text-sm tracking-widest uppercase text-center">
											{info.name}
										</h3>

										{pl && (
											<div className="flex justify-center">
												<MemberCard
													member={pl}
													position="Project Leader"
													onClick={openMember}
												/>
											</div>
										)}

										<div className="flex flex-wrap gap-2 justify-center">
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
							<div className="flex items-center gap-4 mb-8">
								<button
									type="button"
									onClick={goBack}
									className="flex items-center gap-2 text-primary hover:underline font-heading text-sm tracking-widest"
								>
									<i className="fas fa-arrow-left" aria-hidden="true" />
									Back to Teams
								</button>
								<h3 className="font-heading text-primary tracking-widest">
									{TEAM_STRUCTURE[selectedTeam].name}
									{selectedDepartment && ` — ${selectedDepartment}`}
								</h3>
							</div>

							{filteredMembers.length === 0 ? (
								<p className="text-center text-text-gray py-12">
									No members found.
								</p>
							) : (
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
									{filteredMembers.map((member, i) => (
										<MemberCard
											key={member.id ?? i}
											member={member}
											onClick={openMember}
										/>
									))}
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

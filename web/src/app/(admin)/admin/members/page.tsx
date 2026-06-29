import Image from "next/image";
import Link from "next/link";
import { toggleMemberStatusAction } from "@/app/actions/members";
import { ParaButton } from "@/components/ui/components/ParaButton";
import { Switch } from "@/components/ui/components/Switch";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminMembers } from "@/lib/api/admin";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import { MemberDeleteButton } from "./MemberDeleteButton";

export const metadata = buildAdminMeta("Members");

export default async function MembersPage() {
	const members = await fetchAdminMembers();

	return (
		<div className="max-w-[1000px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Members
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<span className="font-body text-[8.5px] text-[#444]">
					{members.length} total
				</span>
				<ParaButton
					href="/admin/members/new"
					size="sm"
					icon={
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<line x1="19" y1="8" x2="19" y2="14" />
							<line x1="22" y1="11" x2="16" y2="11" />
						</svg>
					}
				>
					Add Member
				</ParaButton>
			</div>

			{members.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<svg
						className="mx-auto mb-4"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,.2)"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No members found.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{members.map((m) => {
						const avatar = buildProfileImageUrl(m.profile_picture);
						return (
							<div
								key={m.id}
								className="bg-[#111] border border-[#1e1e1e] border-l-[2px] border-l-primary/20 rounded-sm px-4 py-3 flex items-center gap-4 hover:border-l-primary/60 transition-colors"
							>
								{/* Avatar */}
								<div className="relative w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
									{avatar ? (
										<Image
											src={avatar}
											alt={m.full_name}
											fill
											sizes="36px"
											className="object-cover"
										/>
									) : (
										<span className="font-heading text-[11px] text-primary">
											{m.full_name.charAt(0)}
										</span>
									)}
								</div>

								{/* Info */}
								<div className="flex-1 min-w-0">
									<p className="font-body font-semibold text-[10px] text-[#e0e0e0] truncate">
										{m.full_name}
									</p>
									<p className="font-body text-[8px] text-[#444] truncate">
										{m.email}
									</p>
								</div>

								{/* Role + team */}
								<div className="hidden sm:flex items-center gap-2 shrink-0">
									<span
										className="font-heading text-[6.5px] tracking-[1.5px] uppercase bg-primary/8 text-primary px-2 py-1"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
										}}
									>
										{m.role.replace(/_/g, " ")}
									</span>
									{m.team && (
										<span className="font-body text-[8px] text-[#444]">
											{m.team.replace(/_/g, " ")}
										</span>
									)}
								</div>

								{/* Status toggle */}
								<form
									action={async () => {
										"use server";
										await toggleMemberStatusAction(m.id);
									}}
								>
									<Switch
										checked={m.status === "active"}
										label={`Toggle ${m.full_name}`}
									/>
									<button type="submit" className="sr-only">
										Toggle
									</button>
								</form>

								{/* Actions */}
								<div className="flex gap-2 shrink-0">
									<Link
										href={`/admin/members/${m.id}/edit`}
										className="text-[#444] hover:text-primary transition-colors p-1"
										aria-label="Edit member"
									>
										<svg
											width="13"
											height="13"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
									</Link>
									<MemberDeleteButton id={m.id} name={m.full_name} />
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

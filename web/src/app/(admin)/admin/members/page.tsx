import { FileEdit, UserPlus, Users } from "lucide-react";
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
					icon={<UserPlus size={11} strokeWidth={2} aria-hidden="true" />}
				>
					Add Member
				</ParaButton>
			</div>

			{members.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<Users size={36} strokeWidth={1.5} stroke="rgba(255,215,0,.2)" className="mx-auto mb-4" aria-hidden="true" />
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
										<FileEdit size={13} strokeWidth={2} aria-hidden="true" />
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

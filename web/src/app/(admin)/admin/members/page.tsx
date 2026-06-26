import Image from "next/image";
import Link from "next/link";
import { toggleMemberStatusAction } from "@/app/actions/members";
import { Button } from "@/components/ui/components/Button";
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
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Members
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<span className="text-text-gray text-sm">{members.length} total</span>
				<Button href="/admin/members/new" size="sm">
					<i className="fas fa-user-plus" aria-hidden="true" />
					Add Member
				</Button>
			</div>

			{members.length === 0 ? (
				<div className="bg-[#111] border border-primary/12 rounded-2xl p-16 text-center text-text-gray">
					<i
						className="fas fa-users text-4xl text-primary/30 mb-4 block"
						aria-hidden="true"
					/>
					No members found.
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{members.map((m) => {
						const avatar = buildProfileImageUrl(m.profile_picture);
						return (
							<div
								key={m.id}
								className="bg-[#111] border border-primary/12 rounded-xl px-4 py-3 flex items-center gap-4"
							>
								{/* Avatar */}
								<div className="relative w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading text-sm font-bold shrink-0 overflow-hidden">
									{avatar ? (
										<Image
											src={avatar}
											alt={m.full_name}
											fill
											sizes="36px"
											className="object-cover"
										/>
									) : (
										m.full_name.charAt(0)
									)}
								</div>

								{/* Info */}
								<div className="flex-1 min-w-0">
									<p className="text-text-light text-sm font-semibold truncate">
										{m.full_name}
									</p>
									<p className="text-text-gray text-xs truncate">{m.email}</p>
								</div>

								{/* Role + team */}
								<div className="hidden sm:flex gap-2 text-xs text-text-gray shrink-0">
									<span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
										{m.role.replace(/_/g, " ")}
									</span>
									{m.team && <span>{m.team.replace(/_/g, " ")}</span>}
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
										className="text-text-gray hover:text-primary transition-colors text-sm px-1"
									>
										<i className="fas fa-pen" aria-hidden="true" />
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

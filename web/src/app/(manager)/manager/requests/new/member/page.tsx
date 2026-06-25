import Link from "next/link";
import { submitRequestAction } from "@/app/actions/requests";
import { RequestMemberForm } from "@/components/forms/requests/RequestMemberForm";

export const metadata = { title: "Request Member — Manager Panel" };

export default function RequestMemberPage() {
	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/manager"
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Request Member
				</h1>
			</div>
			<RequestMemberForm action={submitRequestAction} />
		</div>
	);
}

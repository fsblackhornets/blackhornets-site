import Link from "next/link";
import { submitRequestAction } from "@/app/actions/requests";
import { RequestSponsorForm } from "@/components/forms/requests/RequestSponsorForm";

export const metadata = { title: "Request Sponsor — Manager Panel" };

export default function RequestSponsorPage() {
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
					Request Sponsor
				</h1>
			</div>
			<RequestSponsorForm action={submitRequestAction} />
		</div>
	);
}

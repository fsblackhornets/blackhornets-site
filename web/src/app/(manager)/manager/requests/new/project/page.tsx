import Link from "next/link";
import { submitRequestAction } from "@/app/actions/requests";
import { RequestProjectForm } from "@/components/forms/requests/RequestProjectForm";

export const metadata = { title: "Request Project — Manager Panel" };

export default function RequestProjectPage() {
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
					Request Project
				</h1>
			</div>
			<RequestProjectForm action={submitRequestAction} />
		</div>
	);
}

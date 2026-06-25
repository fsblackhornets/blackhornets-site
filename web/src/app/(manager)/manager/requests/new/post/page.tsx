import Link from "next/link";
import { submitRequestAction } from "@/app/actions/requests";
import { RequestPostForm } from "@/components/forms/requests/RequestPostForm";

export const metadata = { title: "Request Post — Manager Panel" };

export default function RequestPostPage() {
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
					Request Post
				</h1>
			</div>
			<RequestPostForm action={submitRequestAction} />
		</div>
	);
}

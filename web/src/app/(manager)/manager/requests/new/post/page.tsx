import { submitRequestAction } from "@/app/actions/requests";
import { RequestPostForm } from "@/components/forms/requests/RequestPostForm";

export const metadata = { title: "Request Post — Manager Panel" };

export default function RequestPostPage() {
	return <RequestPostForm action={submitRequestAction} />;
}

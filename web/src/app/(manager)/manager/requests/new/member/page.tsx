import { submitRequestAction } from "@/app/actions/requests";
import { RequestMemberForm } from "@/components/forms/requests/RequestMemberForm";

export const metadata = { title: "Request Member — Manager Panel" };

export default function RequestMemberPage() {
	return <RequestMemberForm action={submitRequestAction} />;
}

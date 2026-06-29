import { submitRequestAction } from "@/app/actions/requests";
import { RequestProjectForm } from "@/components/forms/requests/RequestProjectForm";

export const metadata = { title: "Request Project — Manager Panel" };

export default function RequestProjectPage() {
	return <RequestProjectForm action={submitRequestAction} />;
}

import { submitRequestAction } from "@/app/actions/requests";
import { RequestSponsorForm } from "@/components/forms/requests/RequestSponsorForm";

export const metadata = { title: "Request Sponsor — Manager Panel" };

export default function RequestSponsorPage() {
	return <RequestSponsorForm action={submitRequestAction} />;
}

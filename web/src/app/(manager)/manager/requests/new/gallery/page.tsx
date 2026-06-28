import { submitRequestAction } from "@/app/actions/requests";
import { RequestGalleryForm } from "@/components/forms/requests/RequestGalleryForm";

export const metadata = { title: "Request Gallery — Manager Panel" };

export default function RequestGalleryPage() {
	return <RequestGalleryForm action={submitRequestAction} />;
}

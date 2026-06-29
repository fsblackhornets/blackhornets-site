import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const messages = await getMessages();
	return (
		<NextIntlClientProvider messages={messages}>
			<Navbar />
			<main className="flex-1">{children}</main>
			<Footer />
		</NextIntlClientProvider>
	);
}

import type { Metadata, Viewport } from "next";
import { Michroma, Poppins, Rajdhani } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
	variable: "--font-michroma",
	subsets: ["latin"],
	weight: "400",
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
	variable: "--font-rajdhani",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Black Hornets Racing",
	description: "Formula Student team from Novi Sad, Serbia",
};

export const viewport: Viewport = {
	themeColor: "#1a1a1a",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			className={`${michroma.variable} ${poppins.variable} ${rajdhani.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-bg-dark text-text-light">
				{children}
			</body>
		</html>
	);
}

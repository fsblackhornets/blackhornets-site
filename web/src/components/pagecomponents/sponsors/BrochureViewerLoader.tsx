"use client";

import dynamic from "next/dynamic";

const BrochureViewer = dynamic(
	() => import("./BrochureViewer").then((m) => m.BrochureViewer),
	{ ssr: false },
);

interface BrochureViewerLoaderProps {
	loading: string;
	fallback: string;
	fallbackLink: string;
}

export function BrochureViewerLoader(props: BrochureViewerLoaderProps) {
	return <BrochureViewer {...props} />;
}

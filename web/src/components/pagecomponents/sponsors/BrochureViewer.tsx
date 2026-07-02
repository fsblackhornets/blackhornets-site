"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

interface BrochureViewerProps {
	loading: string;
	fallback: string;
	fallbackLink: string;
}

export function BrochureViewer({
	loading,
	fallback,
	fallbackLink,
}: BrochureViewerProps) {
	const [numPages, setNumPages] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [error, setError] = useState(false);

	const goPrev = useCallback(() => setPageNumber((p) => Math.max(1, p - 1)), []);
	const goNext = useCallback(
		() => setPageNumber((p) => Math.min(numPages, p + 1)),
		[numPages],
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") goPrev();
			if (e.key === "ArrowRight") goNext();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [goPrev, goNext]);

	if (error) {
		return (
			<p className="p-6 text-center font-body text-text-gray text-sm">
				{fallback}{" "}
				<a
					href="/files/brochure.pdf"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline"
				>
					{fallbackLink}
				</a>
			</p>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={goPrev}
					disabled={pageNumber <= 1}
					className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary/10 transition-colors shrink-0"
					aria-label="Previous page"
				>
					<ChevronLeftIcon className="w-4 h-4" />
				</button>

				<Document
					file="/files/brochure.pdf"
					onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					onLoadError={() => setError(true)}
					loading={
						<div className="w-[900px] max-w-[85vw] h-[1200px] flex items-center justify-center text-text-gray text-sm">
							{loading}
						</div>
					}
				>
					<Page
						pageNumber={pageNumber}
						width={900}
						renderTextLayer={false}
						renderAnnotationLayer={false}
						loading={
							<div className="w-[900px] max-w-[85vw] h-[1200px] flex items-center justify-center text-text-gray text-sm">
								{loading}
							</div>
						}
					/>
					{/* prefetch neighbors off-screen so paging there feels instant */}
					<div className="hidden">
						{pageNumber > 1 && (
							<Page
								key={pageNumber - 1}
								pageNumber={pageNumber - 1}
								width={900}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						)}
						{pageNumber < numPages && (
							<Page
								key={pageNumber + 1}
								pageNumber={pageNumber + 1}
								width={900}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						)}
					</div>
				</Document>

				<button
					type="button"
					onClick={goNext}
					disabled={pageNumber >= numPages}
					className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary/10 transition-colors shrink-0"
					aria-label="Next page"
				>
					<ChevronRightIcon className="w-4 h-4" />
				</button>
			</div>

			{numPages > 0 && (
				<p className="font-heading text-[10px] tracking-[2px] uppercase text-text-gray">
					{pageNumber} / {numPages}
				</p>
			)}
		</div>
	);
}

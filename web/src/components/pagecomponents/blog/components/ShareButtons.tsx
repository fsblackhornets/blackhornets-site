"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { INSTAGRAM_URL } from "@/constants/links";

function CopyLinkButton({
	url,
	variant,
	label,
}: {
	url: string;
	variant: "compact" | "full";
	label: string;
}) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	if (variant === "compact") {
		return (
			<button
				type="button"
				onClick={handleCopy}
				aria-label={label}
				className="w-[30px] h-[30px] rounded-full border border-primary/20 flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
			>
				<Link2 size={12} strokeWidth={2} aria-hidden="true" />
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			aria-label={label}
			className="flex items-center gap-2.5 p-2.5 bg-bg-dark border border-[#1e1e1e] rounded-sm text-text-gray hover:text-primary hover:border-primary/30 transition-colors"
		>
			<Link2 size={12} strokeWidth={2} aria-hidden="true" />
			<span className="font-body text-[9px]">{copied ? "Copied!" : label}</span>
		</button>
	);
}

export function ShareButtons({
	url,
	variant,
	labels,
}: {
	url: string;
	variant: "compact" | "full";
	labels: { facebook: string; instagram: string; copyLink: string };
}) {
	const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

	if (variant === "compact") {
		return (
			<>
				<a
					href={fbHref}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={labels.facebook}
					className="w-[30px] h-[30px] rounded-full border border-primary/20 flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
				>
					<FacebookIcon className="w-3 h-3" />
				</a>
				<a
					href={INSTAGRAM_URL}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={labels.instagram}
					className="w-[30px] h-[30px] rounded-full border border-primary/20 flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
				>
					<InstagramIcon className="w-3 h-3" />
				</a>
				<CopyLinkButton url={url} variant="compact" label={labels.copyLink} />
			</>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			<a
				href={fbHref}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={labels.facebook}
				className="flex items-center gap-2.5 p-2.5 bg-bg-dark border border-[#1e1e1e] rounded-sm text-text-gray hover:text-primary hover:border-primary/30 transition-colors"
			>
				<FacebookIcon className="w-3 h-3" />
				<span className="font-body text-[9px]">{labels.facebook}</span>
			</a>
			<a
				href={INSTAGRAM_URL}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={labels.instagram}
				className="flex items-center gap-2.5 p-2.5 bg-bg-dark border border-[#1e1e1e] rounded-sm text-text-gray hover:text-primary hover:border-primary/30 transition-colors"
			>
				<InstagramIcon className="w-3 h-3" />
				<span className="font-body text-[9px]">{labels.instagram}</span>
			</a>
			<CopyLinkButton url={url} variant="full" label={labels.copyLink} />
		</div>
	);
}

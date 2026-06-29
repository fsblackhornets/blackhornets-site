import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 relative overflow-hidden">
			{/* Grid overlay */}
			<div
				className="fixed inset-0 pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,215,0,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,.015) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
				aria-hidden="true"
			/>

			{/* 404 watermark */}
			<span
				className="absolute font-heading text-primary select-none pointer-events-none tracking-[-6px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				style={{ fontSize: "clamp(160px, 30vw, 300px)", opacity: 0.025 }}
				aria-hidden="true"
			>
				404
			</span>

			{/* Racing stripe top */}
			<div className="absolute top-0 inset-x-0 flex h-[3px]" aria-hidden="true">
				<div className="flex-1 bg-primary" />
				<div className="w-16 bg-transparent" />
				<div className="w-7 bg-primary" />
			</div>

			{/* Content */}
			<div className="relative z-10 text-center">
				<p className="font-heading text-[9px] tracking-[8px] uppercase text-primary/50 mb-6">
					Black Hornets Racing
				</p>

				<h1
					className="font-heading font-black uppercase tracking-[4px] text-white mb-2"
					style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}
				>
					404
				</h1>

				<p
					className="font-heading uppercase tracking-[4px] text-white mb-2"
					style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
				>
					Page{" "}
					<span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
						Not Found
					</span>
				</p>

				{/* Speed lines */}
				<div className="flex justify-center gap-1 my-5" aria-hidden="true">
					<div className="w-14 h-px bg-primary/20" />
					<div className="w-5 h-px bg-primary" />
					<div className="w-2 h-px bg-primary/20" />
				</div>

				<p className="font-body text-[10px] tracking-[3px] uppercase text-[#444] mb-8">
					The page you&apos;re looking for doesn&apos;t exist.
				</p>

				<div className="flex items-center justify-center gap-3 flex-wrap">
					<Link
						href="/"
						className="bg-primary text-black font-heading text-[8px] tracking-[3px] uppercase py-3 px-6 hover:bg-yellow-300 transition-colors"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
						}}
					>
						Back to Home
					</Link>
					<Link
						href="/contact"
						className="border border-primary text-primary font-heading text-[8px] tracking-[3px] uppercase py-3 px-6 hover:bg-primary/10 transition-colors"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
						}}
					>
						Contact Us
					</Link>
				</div>
			</div>

			{/* Racing stripe bottom */}
			<div
				className="absolute bottom-0 inset-x-0 flex h-[3px]"
				aria-hidden="true"
			>
				<div className="flex-1 bg-primary" />
				<div className="w-16 bg-transparent" />
				<div className="w-7 bg-primary" />
			</div>
		</div>
	);
}

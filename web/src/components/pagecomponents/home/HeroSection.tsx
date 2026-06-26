import Image from "next/image";
import Link from "next/link";
import { BlogIcon } from "@/components/icons/BlogIcon";

export function HeroSection() {
	return (
		<section className="relative min-h-screen bg-gradient-to-br from-black to-bg-panel overflow-hidden flex items-center justify-center">
			{/* Animated background */}
			<div
				className="absolute inset-0 z-[1]"
				style={{
					background:
						"radial-gradient(circle at center, rgba(26,26,26,0.8) 0%, rgba(0,0,0,0.95) 100%)",
				}}
			>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(45deg, transparent 0%, rgba(255,215,0,0.05) 25%, transparent 50%)",
						backgroundSize: "200% 200%",
					}}
				/>
				<div className="hero-grid-overlay absolute inset-0" />
			</div>

			{/* Content */}
			<div className="relative z-[3] text-center px-8 pt-32 w-full max-w-5xl mx-auto">
				<div className="mb-12 inline-block">
					<Image
						src="/images/stiker.png"
						alt="Black Hornets Logo"
						width={160}
						height={160}
						className="drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform duration-300"
						priority
					/>
				</div>

				<h1 className="font-heading text-[clamp(2.5rem,8vw,4.5rem)] font-black tracking-[6px] text-primary mt-4">
					Black Hornets
				</h1>

				<p className="text-[2rem] text-text-light tracking-[4px] mt-6 animate-fade-in">
					Formula Student Novi Sad
				</p>

				<div className="flex gap-6 justify-center mt-8 flex-wrap">
					<Link
						href="/about"
						className="inline-flex items-center gap-2 px-10 py-4 rounded-full border-2 border-primary text-primary font-heading font-bold tracking-widest hover:bg-primary hover:text-black transition-colors duration-300"
					>
						Discover More
						<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
					</Link>
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 px-10 py-4 rounded-full border-2 border-primary text-primary font-heading font-bold tracking-widest hover:bg-primary hover:text-black transition-colors duration-300"
					>
						<BlogIcon className="w-4 h-4" />
						Blog
					</Link>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-text-gray font-heading">
				<div className="w-[30px] h-[50px] border-2 border-text-gray rounded-[25px] mx-auto mb-2 flex justify-center pt-2">
					<div className="w-1.5 h-1.5 bg-primary rounded-full animate-scroll-mouse" />
				</div>
				<span className="text-xs tracking-widest">Scroll Down</span>
			</div>
		</section>
	);
}

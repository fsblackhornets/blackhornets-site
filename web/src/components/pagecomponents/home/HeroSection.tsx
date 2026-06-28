import Link from "next/link";
import { BlogIcon } from "@/components/icons/BlogIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

export function HeroSection() {
	return (
		<section
			className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
			style={{ background: "#080808" }}
		>
			{/* Racing stripes */}
			<div className="absolute top-0 left-0 right-0 z-10">
				<div style={{ height: "6px", background: "#ffd700" }} />
				<div style={{ height: "4px" }} />
				<div style={{ height: "2px", background: "#ffd700", opacity: 0.5 }} />
			</div>

			{/* BHR watermark */}
			<div
				className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
				aria-hidden="true"
			>
				<span
					className="font-heading font-black text-white"
					style={{
						fontSize: "clamp(10rem, 45vw, 38rem)",
						opacity: 0.03,
						letterSpacing: "0.05em",
						lineHeight: 1,
					}}
				>
					BHR
				</span>
			</div>

			{/* Content */}
			<div className="relative z-[3] text-center px-8 pt-32 w-full max-w-5xl mx-auto flex flex-col items-center">
				{/* Subtitle */}
				<p
					className="font-heading text-text-gray text-xs uppercase mb-10"
					style={{ letterSpacing: "0.4em" }}
				>
					Formula Student · Novi Sad
				</p>

				{/* 3-line title */}
				<h1
					className="font-heading font-black leading-[1.05]"
					style={{ fontSize: "clamp(3rem, 11vw, 7.5rem)" }}
				>
					<span className="block text-white">Black</span>
					<span
						className="block"
						style={{
							background:
								"linear-gradient(90deg, #ffd700 0%, #ffe566 50%, #ffd700 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						Hornets
					</span>
					<span className="block text-white">Racing</span>
				</h1>

				{/* Speed lines */}
				<div className="flex flex-col items-center gap-1.5 my-10">
					<div style={{ width: "80px", height: "3px", background: "#ffd700" }} />
					<div
						style={{
							width: "52px",
							height: "2px",
							background: "#ffd700",
							opacity: 0.55,
						}}
					/>
					<div
						style={{
							width: "32px",
							height: "1px",
							background: "#ffd700",
							opacity: 0.25,
						}}
					/>
				</div>

				{/* CTA */}
				<div className="flex gap-6 justify-center flex-wrap">
					<Link
						href="/about"
						className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-black font-heading font-bold tracking-widest hover:bg-yellow-400 transition-colors duration-300"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
						}}
					>
						Discover More
						<ChevronRightIcon className="w-4 h-4" />
					</Link>
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 px-10 py-4 font-heading font-bold tracking-widest text-primary hover:bg-primary hover:text-black transition-colors duration-300"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
							border: "2px solid #ffd700",
						}}
					>
						<BlogIcon className="w-4 h-4" />
						Blog
					</Link>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-text-gray font-heading z-[3]">
				<div className="w-[30px] h-[50px] border-2 border-text-gray rounded-[25px] mx-auto mb-2 flex justify-center pt-2">
					<div className="w-1.5 h-1.5 bg-primary rounded-full animate-scroll-mouse" />
				</div>
				<span className="text-xs tracking-widest">Scroll Down</span>
			</div>

			{/* Gold bottom border */}
			<div
				className="absolute bottom-0 left-0 right-0 z-10"
				style={{ height: "3px", background: "#ffd700" }}
			/>
		</section>
	);
}

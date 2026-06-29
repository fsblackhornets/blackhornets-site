import type { Metadata } from "next";
import { ApplyForm } from "@/components/forms/apply/ApplyForm";
import {
	DEPARTMENTS,
	REQUIREMENTS,
} from "@/constants/apply";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";

export const metadata: Metadata = {
	title: `Apply — ${SITE_NAME}`,
	description:
		"Join Black Hornets Racing. Apply to be part of our Formula Student team from the University of Novi Sad.",
	openGraph: {
		title: `Apply — ${SITE_NAME}`,
		description: "Join Black Hornets Racing Formula Student team.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default function ApplyPage() {
	return (
		<>
			{/* Hero */}
			<section className="relative h-[52vh] min-h-[360px] overflow-hidden flex items-center justify-center">
				{/* Racing stripe */}
				<div className="flex h-[4px] absolute top-0 inset-x-0 z-20">
					<div className="flex-1 bg-primary" />
					<div className="w-16 bg-transparent" />
					<div className="w-7 bg-primary" />
				</div>

				{/* Background */}
				<div
					className="absolute inset-0 z-0"
					style={{
						background:
							"linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)",
					}}
				/>
				<div
					className="absolute inset-0 z-0"
					style={{
						background:
							"radial-gradient(circle at 30% 50%, rgba(255,215,0,0.04) 0%, transparent 60%)",
					}}
				/>

				{/* APPLY watermark */}
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
					aria-hidden="true"
				>
					<span
						className="font-heading font-black text-white"
						style={{
							fontSize: "200px",
							opacity: 0.035,
							letterSpacing: "-4px",
							lineHeight: 1,
						}}
					>
						APPLY
					</span>
				</div>

				{/* Content */}
				<div className="relative z-20 text-center px-8 flex flex-col items-center">
					<h1 className="font-heading text-[44px] font-black tracking-[3px] uppercase leading-[1.05]">
						<span className="block text-white">Join</span>
						<span className="block bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
							Our Team
						</span>
					</h1>

					{/* Speed lines */}
					<div className="flex gap-1.5 items-center my-5">
						<div
							style={{
								width: "52px",
								height: "2px",
								background: "#ffd700",
								opacity: 0.9,
							}}
						/>
						<div
							style={{
								width: "16px",
								height: "1.5px",
								background: "#ffd700",
								opacity: 0.5,
							}}
						/>
						<div
							style={{
								width: "8px",
								height: "1px",
								background: "#ffd700",
								opacity: 0.2,
							}}
						/>
					</div>

					<p className="font-body font-light text-text-gray text-xs tracking-[4px] uppercase">
						Be part of something extraordinary
					</p>
				</div>

				{/* Gold bottom border */}
				<div
					className="absolute bottom-0 inset-x-0 z-20"
					style={{ height: "3px", background: "#ffd700" }}
				/>
			</section>

			{/* Main content */}
			<section className="py-16 px-4 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
					{/* Sidebar */}
					<div className="flex flex-col gap-6">
						{/* Requirements */}
						<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary bg-bg-panel p-6">
							<div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#1e1e1e]">
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#ffd700"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<title>Requirements</title>
									<path d="M9 11l3 3L22 4" />
									<path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
								</svg>
								<span className="font-heading text-[9px] tracking-[4px] uppercase text-primary">
									Requirements
								</span>
							</div>
							<div className="flex flex-col gap-5">
								{REQUIREMENTS.map(({ icon, title, desc }) => (
									<div key={title} className="flex gap-3">
										<div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
											<i
												className={`${icon} text-primary text-xs`}
												aria-hidden="true"
											/>
										</div>
										<div>
											<p className="font-heading text-[9px] tracking-[2px] uppercase text-[#e0e0e0] mb-0.5">
												{title}
											</p>
											<p className="font-body text-[11px] text-text-gray leading-relaxed">
												{desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Departments */}
						<div className="rounded-sm border border-[#1e1e1e] bg-bg-panel p-6">
							<div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#1e1e1e]">
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#ffd700"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<title>Departments</title>
									<rect x="3" y="3" width="7" height="7" />
									<rect x="14" y="3" width="7" height="7" />
									<rect x="14" y="14" width="7" height="7" />
									<rect x="3" y="14" width="7" height="7" />
								</svg>
								<span className="font-heading text-[9px] tracking-[4px] uppercase text-primary">
									Departments
								</span>
							</div>
							<div className="flex flex-col gap-5">
								{DEPARTMENTS.map(({ icon, title, items }) => (
									<div key={title}>
										<div className="flex items-center gap-2 mb-2">
											<i
												className={`${icon} text-primary text-[10px]`}
												aria-hidden="true"
											/>
											<span className="font-heading text-[9px] tracking-[2px] uppercase text-[#e0e0e0]">
												{title}
											</span>
										</div>
										<ul className="flex flex-col gap-1 ml-4">
											{items.map((item) => (
												<li
													key={item}
													className="flex items-center gap-2 font-body text-text-gray text-[11px]"
												>
													<span
														className="text-primary shrink-0"
														style={{ fontSize: "10px" }}
													>
														—
													</span>
													{item}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Form */}
					<ApplyForm />
				</div>
			</section>
		</>
	);
}

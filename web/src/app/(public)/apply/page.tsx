import type { Metadata } from "next";
import { ApplyForm } from "@/components/forms/apply/ApplyForm";
import {
	DEPARTMENTS,
	REQUIREMENTS,
} from "@/components/pagecomponents/apply/constants";
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
			<section className="relative py-28 flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, transparent 70%)",
					}}
				/>
				<div className="relative z-10 text-center px-8">
					<p className="text-primary text-sm font-heading tracking-[4px] uppercase mb-3">
						Black Hornets Racing
					</p>
					<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
						Join Our Team
					</h1>
					<p className="text-text-light text-xl tracking-widest mt-4">
						Be part of something extraordinary
					</p>
					<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
				</div>
			</section>

			<section className="py-16 px-4 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
					{/* Info panels */}
					<div className="flex flex-col gap-6">
						<div className="bg-bg-panel rounded-2xl border border-gray-mid p-6">
							<div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-mid">
								<i
									className="fas fa-clipboard-check text-primary"
									aria-hidden="true"
								/>
								<h2 className="font-heading text-sm tracking-widest text-primary uppercase">
									Requirements
								</h2>
							</div>
							<div className="flex flex-col gap-4">
								{REQUIREMENTS.map(({ icon, title, desc }) => (
									<div key={title} className="flex gap-3">
										<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
											<i
												className={`${icon} text-primary text-xs`}
												aria-hidden="true"
											/>
										</div>
										<div>
											<h3 className="text-text-light text-sm font-semibold">
												{title}
											</h3>
											<p className="text-text-gray text-xs">{desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="bg-bg-panel rounded-2xl border border-gray-mid p-6">
							<div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-mid">
								<i className="fas fa-sitemap text-primary" aria-hidden="true" />
								<h2 className="font-heading text-sm tracking-widest text-primary uppercase">
									Departments
								</h2>
							</div>
							<div className="flex flex-col gap-5">
								{DEPARTMENTS.map(({ icon, title, items }) => (
									<div key={title}>
										<div className="flex items-center gap-2 mb-2">
											<i
												className={`${icon} text-primary text-xs`}
												aria-hidden="true"
											/>
											<h3 className="text-text-light text-sm font-semibold">
												{title}
											</h3>
										</div>
										<ul className="ml-5 flex flex-col gap-1">
											{items.map((item) => (
												<li
													key={item}
													className="text-text-gray text-xs list-disc"
												>
													{item}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Application form */}
					<ApplyForm />
				</div>
			</section>
		</>
	);
}

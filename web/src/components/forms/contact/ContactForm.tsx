"use client";

import { Spinner } from "@/components/ui/components/Spinner";
import { useContactForm } from "@/hooks/contact/useContactForm";

export function ContactForm() {
	const { state, action, pending, formRef } = useContactForm();

	return (
		<form ref={formRef} action={action} className="flex flex-col gap-5">
			{state.status === "success" && (
				<div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4 text-green-400 text-sm flex items-center gap-2">
					<i className="fas fa-check-circle" aria-hidden="true" />
					{state.message}
				</div>
			)}
			{state.status === "error" && !state.errors && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-red-400 text-sm flex items-center gap-2">
					<i className="fas fa-exclamation-circle" aria-hidden="true" />
					{state.message}
				</div>
			)}

			{/* Full Name */}
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="name"
					className="font-heading text-[8px] tracking-[3px] uppercase text-text-gray"
				>
					Full Name
				</label>
				<input
					id="name"
					type="text"
					name="name"
					required
					placeholder="Your name"
					className="bg-bg-dark border border-gray-dark rounded-sm px-4 py-3 text-sm font-body text-text-light placeholder:text-text-gray outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors w-full"
				/>
				{state.errors?.name && (
					<p className="text-red-400 text-xs">{state.errors.name}</p>
				)}
			</div>

			{/* Email */}
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="email"
					className="font-heading text-[8px] tracking-[3px] uppercase text-text-gray"
				>
					Email Address
				</label>
				<input
					id="email"
					type="email"
					name="email"
					required
					placeholder="your@email.com"
					className="bg-bg-dark border border-gray-dark rounded-sm px-4 py-3 text-sm font-body text-text-light placeholder:text-text-gray outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors w-full"
				/>
				{state.errors?.email && (
					<p className="text-red-400 text-xs">{state.errors.email}</p>
				)}
			</div>

			{/* Subject */}
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="subject"
					className="font-heading text-[8px] tracking-[3px] uppercase text-text-gray"
				>
					Subject
				</label>
				<input
					id="subject"
					type="text"
					name="subject"
					required
					placeholder="What's this about?"
					className="bg-bg-dark border border-gray-dark rounded-sm px-4 py-3 text-sm font-body text-text-light placeholder:text-text-gray outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors w-full"
				/>
				{state.errors?.subject && (
					<p className="text-red-400 text-xs">{state.errors.subject}</p>
				)}
			</div>

			{/* Message */}
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="message"
					className="font-heading text-[8px] tracking-[3px] uppercase text-text-gray"
				>
					Message
				</label>
				<textarea
					id="message"
					name="message"
					required
					rows={6}
					placeholder="Your message…"
					className="bg-bg-dark border border-gray-dark rounded-sm px-4 py-3 text-sm font-body text-text-light placeholder:text-text-gray outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors w-full resize-none"
				/>
				{state.errors?.message && (
					<p className="text-red-400 text-xs">{state.errors.message}</p>
				)}
			</div>

			{/* Honeypot */}
			<div className="absolute left-[-9999px]" aria-hidden="true">
				<input
					type="text"
					name="website_url"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={pending}
				className="mt-2 inline-flex items-center justify-center gap-2 px-7 py-3.5 font-heading text-[9px] tracking-[3px] uppercase text-black bg-primary hover:bg-yellow-400 disabled:opacity-60 transition-colors duration-300"
				style={{
					clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 100%, 9px 100%)",
				}}
			>
				{pending ? (
					<>
						<Spinner size="sm" />
						Sending…
					</>
				) : (
					<>
						<i className="fas fa-paper-plane" aria-hidden="true" />
						Send Message
					</>
				)}
			</button>
		</form>
	);
}

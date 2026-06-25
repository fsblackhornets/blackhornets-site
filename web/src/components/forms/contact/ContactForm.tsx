"use client";

import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import { useContactForm } from "@/hooks/contact/useContactForm";

export function ContactForm() {
	const { state, action, pending, formRef } = useContactForm();

	return (
		<form ref={formRef} action={action} className="flex flex-col gap-5">
			{state.status === "success" && (
				<div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm flex items-center gap-2">
					<i className="fas fa-check-circle" aria-hidden="true" />
					{state.message}
				</div>
			)}
			{state.status === "error" && !state.errors && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
					<i className="fas fa-exclamation-circle" aria-hidden="true" />
					{state.message}
				</div>
			)}

			<Field label="Full Name" htmlFor="name" error={state.errors?.name}>
				<Input
					id="name"
					type="text"
					name="name"
					required
					placeholder="Your name"
				/>
			</Field>

			<Field label="Email Address" htmlFor="email" error={state.errors?.email}>
				<Input
					id="email"
					type="email"
					name="email"
					required
					placeholder="your@email.com"
				/>
			</Field>

			<Field label="Subject" htmlFor="subject" error={state.errors?.subject}>
				<Input
					id="subject"
					type="text"
					name="subject"
					required
					placeholder="What's this about?"
				/>
			</Field>

			<Field label="Message" htmlFor="message" error={state.errors?.message}>
				<Textarea
					id="message"
					name="message"
					required
					rows={6}
					placeholder="Your message…"
				/>
			</Field>

			{/* Honeypot */}
			<div className="absolute left-[-9999px]" aria-hidden="true">
				<input
					type="text"
					name="website_url"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			<SubmitButton
				pending={pending}
				label="Send Message"
				pendingLabel="Sending…"
				icon="fas fa-paper-plane"
				className="mt-2"
			/>
		</form>
	);
}

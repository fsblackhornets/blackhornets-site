"use client";

import Image from "next/image";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

export function LoginForm() {
	const { state, action, pending } = useLoginForm();

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-dark px-4">
			<div className="w-full max-w-sm">
				<div className="flex justify-center mb-8">
					<Image
						src="/images/logo.png"
						alt="Black Hornets Racing"
						width={64}
						height={64}
						className="h-16 w-auto"
					/>
				</div>

				<h1 className="font-heading text-2xl text-primary tracking-widest uppercase text-center mb-2">
					Admin Login
				</h1>
				<p className="text-text-gray text-sm text-center mb-8">
					Black Hornets Racing Panel
				</p>

				<form action={action} className="flex flex-col gap-4">
					{state.error && (
						<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
							<i className="fas fa-exclamation-circle" aria-hidden="true" />
							{state.error}
						</div>
					)}

					<Field label="Username" htmlFor="username">
						<Input
							id="username"
							type="text"
							name="username"
							required
							autoComplete="username"
							placeholder="Enter your username"
						/>
					</Field>

					<Field label="Password" htmlFor="password">
						<Input
							id="password"
							type="password"
							name="password"
							required
							autoComplete="current-password"
							placeholder="Enter your password"
						/>
					</Field>

					<SubmitButton
						pending={pending}
						label="Sign In"
						pendingLabel="Signing in…"
						icon="fas fa-sign-in-alt"
						className="mt-2"
					/>
				</form>
			</div>
		</div>
	);
}

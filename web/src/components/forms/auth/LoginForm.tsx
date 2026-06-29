"use client";

import { Hexagon } from "lucide-react";
import { AlertCircleIcon, ArrowRightIcon } from "@/components/icons";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

export function LoginForm() {
	const { state, action, pending } = useLoginForm();

	return (
		<div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
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

			{/* BHR watermark */}
			<span
				className="fixed font-heading text-primary select-none pointer-events-none tracking-[-4px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				style={{ fontSize: "clamp(120px, 25vw, 240px)", opacity: 0.02 }}
				aria-hidden="true"
			>
				BHR
			</span>

			{/* Card */}
			<div className="relative w-full max-w-[340px] z-10">
				{/* Racing stripe above card */}
				<div className="flex h-[3px]">
					<div className="flex-1 bg-primary" />
					<div className="w-14 bg-transparent" />
					<div className="w-6 bg-primary" />
				</div>

				<div className="bg-[#0e0e0e] border border-[#1e1e1e] border-t-[3px] border-t-primary rounded-sm px-8 py-10">
					{/* Logo */}
					<div className="w-12 h-12 rounded-full border-[1.5px] border-primary/40 bg-primary/5 flex items-center justify-center mx-auto">
						<Hexagon
							size={22}
							strokeWidth={1.5}
							stroke="#ffd700"
							aria-hidden="true"
						/>
					</div>
					<p className="font-heading text-[7px] tracking-[6px] uppercase text-primary/60 text-center mt-3">
						Black Hornets Racing
					</p>

					{/* Heading */}
					<h1
						className="font-heading uppercase tracking-[4px] text-white text-center mt-8"
						style={{ fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}
					>
						Admin{" "}
						<span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
							Login
						</span>
					</h1>
					<p className="font-body text-[9px] tracking-[3px] uppercase text-[#333] text-center mt-2 mb-8">
						Secure access panel
					</p>

					<form action={action} className="flex flex-col gap-4">
						{state.error && (
							<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 flex items-center gap-2 text-red-400 text-[9px]">
								<AlertCircleIcon size={12} />
								{state.error}
							</div>
						)}

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="username"
								className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-1.5 block"
							>
								Username
							</label>
							<input
								id="username"
								type="text"
								name="username"
								required
								autoComplete="username"
								placeholder="Enter your username"
								className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-none px-3 py-2.5 text-[10px] font-body text-[#e0e0e0] placeholder:text-[#2a2a2a] focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none transition-colors w-full"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="password"
								className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-1.5 block"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								name="password"
								required
								autoComplete="current-password"
								placeholder="Enter your password"
								className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-none px-3 py-2.5 text-[10px] font-body text-[#e0e0e0] placeholder:text-[#2a2a2a] focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none transition-colors w-full"
							/>
						</div>

						<button
							type="submit"
							disabled={pending}
							className="w-full bg-primary text-black font-heading text-[8px] tracking-[3px] uppercase py-3.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 9px) 0, 100% 100%, 9px 100%)",
							}}
						>
							{pending ? (
								<>
									<span
										className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"
										aria-hidden="true"
									/>
									Signing in…
								</>
							) : (
								<>
									<ArrowRightIcon size={12} />
									Sign In
								</>
							)}
						</button>
					</form>

					{/* Speed lines */}
					<div className="flex justify-center gap-1 mt-6">
						<div className="w-12 h-px bg-primary/15" />
						<div className="w-4 h-px bg-primary/40" />
						<div className="w-2 h-px bg-primary/15" />
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import {
	POSITION_OPTIONS,
	YEAR_OPTIONS,
} from "@/components/pagecomponents/apply/constants";
import { useApplyForm } from "@/hooks/apply/useApplyForm";

const inputCls =
	"bg-[#0e0e0e] border border-[#2a2a2a] rounded-none text-[#e0e0e0] text-sm px-3 py-2.5 w-full focus:outline-none focus:border-primary/50 transition-colors";
const labelCls =
	"font-heading text-[8px] tracking-[2px] uppercase text-text-gray mb-1.5 block";

function CardHeader({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#1e1e1e]">
			<div className="w-[3px] h-4 bg-primary shrink-0" />
			<span className="font-heading text-[9px] tracking-[4px] uppercase text-primary">
				{label}
			</span>
		</div>
	);
}

export function ApplyForm() {
	const {
		state,
		action,
		pending,
		fileName,
		setFileName,
		academicYear,
		setAcademicYear,
		position,
		setPosition,
		formRef,
		handleReset,
	} = useApplyForm();

	return (
		<form
			ref={formRef}
			action={action}
			onReset={handleReset}
			className="flex flex-col gap-6"
		>
			{state.status === "success" && (
				<div className="border-l-2 border-l-green-500 bg-green-500/10 px-4 py-3 text-green-400 text-sm flex items-center gap-2">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
					{state.message}
				</div>
			)}
			{state.status === "error" && (
				<div className="border-l-2 border-l-red-500 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex items-center gap-2">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					{state.message}
				</div>
			)}

			{/* Personal Info */}
			<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary bg-bg-panel p-6">
				<CardHeader label="Personal Information" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="firstName" className={labelCls}>
							First Name
						</label>
						<input
							id="firstName"
							type="text"
							name="firstName"
							required
							className={inputCls}
						/>
						{state.errors?.firstName && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.firstName}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="lastName" className={labelCls}>
							Last Name
						</label>
						<input
							id="lastName"
							type="text"
							name="lastName"
							required
							className={inputCls}
						/>
						{state.errors?.lastName && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.lastName}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="email" className={labelCls}>
							Email Address
						</label>
						<input
							id="email"
							type="email"
							name="email"
							required
							className={inputCls}
						/>
						{state.errors?.email && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.email}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="phone" className={labelCls}>
							Phone Number
						</label>
						<input
							id="phone"
							type="tel"
							name="phone"
							required
							className={inputCls}
						/>
						{state.errors?.phone && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.phone}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Academic Info */}
			<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-6">
				<CardHeader label="Academic Information" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="studentId" className={labelCls}>
							Student ID
						</label>
						<input
							id="studentId"
							type="text"
							name="studentId"
							required
							className={inputCls}
						/>
						{state.errors?.studentId && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.studentId}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="faculty" className={labelCls}>
							Faculty
						</label>
						<input
							id="faculty"
							type="text"
							name="faculty"
							required
							className={inputCls}
						/>
						{state.errors?.faculty && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.faculty}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="major" className={labelCls}>
							Major
						</label>
						<input
							id="major"
							type="text"
							name="major"
							required
							className={inputCls}
						/>
						{state.errors?.major && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.major}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="gpa" className={labelCls}>
							GPA (6.00 – 10.00)
						</label>
						<input
							id="gpa"
							type="number"
							name="gpa"
							step="0.01"
							min="6"
							max="10"
							required
							className={inputCls}
						/>
						{state.errors?.gpa && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.gpa}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="academic_year" className={labelCls}>
							Academic Year
						</label>
						<select
							id="academic_year"
							name="academic_year"
							required
							value={academicYear}
							onChange={(e) => setAcademicYear(e.target.value)}
							className={`${inputCls} appearance-none`}
						>
							<option value="" disabled>
								Select Year
							</option>
							{YEAR_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
						{state.errors?.academic_year && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.academic_year}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="years_studying" className={labelCls}>
							Years Currently Studying
						</label>
						<input
							id="years_studying"
							type="number"
							name="years_studying"
							min="1"
							max="10"
							placeholder="e.g. 3"
							required
							className={inputCls}
						/>
						{state.errors?.years_studying && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.years_studying}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Team Preferences */}
			<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-6">
				<CardHeader label="Team Preferences" />
				<div className="flex flex-col gap-4">
					<div>
						<label htmlFor="position" className={labelCls}>
							Desired Position
						</label>
						<select
							id="position"
							name="position"
							required
							value={position}
							onChange={(e) => setPosition(e.target.value)}
							className={`${inputCls} appearance-none`}
						>
							<option value="" disabled>
								Select department
							</option>
							{POSITION_OPTIONS.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
						{state.errors?.position && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.position}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="experience" className={labelCls}>
							Relevant Experience (optional)
						</label>
						<textarea
							id="experience"
							name="experience"
							rows={3}
							className={`${inputCls} resize-none`}
						/>
						{state.errors?.experience && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.experience}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="motivation" className={labelCls}>
							Why do you want to join our team?
						</label>
						<textarea
							id="motivation"
							name="motivation"
							rows={5}
							required
							className={`${inputCls} resize-none`}
						/>
						{state.errors?.motivation && (
							<p className="text-red-400 text-[10px] mt-1">
								{state.errors.motivation}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Resume */}
			<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-6">
				<CardHeader label="Resume / CV" />
				<div>
					<p className={labelCls}>Resume (PDF only · max 5MB)</p>
					<div className="flex items-center gap-4 mt-1.5">
						<label
							htmlFor="resume"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							}}
							className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 text-primary font-heading text-[9px] tracking-[3px] uppercase hover:bg-primary hover:text-bg-dark transition-colors"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
							Choose File
						</label>
						<span className="font-body text-text-gray text-sm">{fileName}</span>
					</div>
					<input
						id="resume"
						type="file"
						name="resume"
						accept=".pdf"
						required
						className="sr-only"
						onChange={(e) =>
							setFileName(e.target.files?.[0]?.name ?? "No file chosen")
						}
					/>
					{state.errors?.resume && (
						<p className="text-red-400 text-[10px] mt-2">
							{state.errors.resume}
						</p>
					)}
				</div>
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
				style={{
					clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
				}}
				className="w-full bg-primary text-bg-dark font-heading text-[10px] tracking-[4px] uppercase py-4 flex items-center justify-center gap-3 transition-opacity disabled:opacity-60 hover:bg-yellow-300"
			>
				{pending ? (
					<>
						<span
							className="inline-block w-4 h-4 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"
							aria-hidden="true"
						/>
						Submitting…
					</>
				) : (
					<>
						Submit Application
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<line x1="22" y1="2" x2="11" y2="13" />
							<polygon points="22 2 15 22 11 13 2 9 22 2" />
						</svg>
					</>
				)}
			</button>
		</form>
	);
}

"use client";

import {
	AlertCircleIcon,
	CheckCircleIcon,
	SendIcon,
	UploadIcon,
} from "@/components/icons";
import { POSITION_OPTIONS, YEAR_OPTIONS } from "@/constants/apply";
import { SECTION_CARD, SECTION_HEAD } from "@/constants/forms";
import { useApplyForm } from "@/hooks/apply/useApplyForm";

const inputCls =
	"bg-[#0e0e0e] border border-[#2a2a2a] rounded-none text-[#e0e0e0] text-sm px-3 py-2.5 w-full focus:outline-none focus:border-primary/50 transition-colors";
const labelCls =
	"font-heading text-[8px] tracking-[2px] uppercase text-text-gray mb-1.5 block";

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
					<CheckCircleIcon size={14} />
					{state.message}
				</div>
			)}
			{state.status === "error" && (
				<div className="border-l-2 border-l-red-500 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex items-center gap-2">
					<AlertCircleIcon size={14} />
					{state.message}
				</div>
			)}

			{/* Personal Info */}
			<div className={SECTION_CARD}>
				<h2 className={SECTION_HEAD}>Personal Information</h2>
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
			<div className={SECTION_CARD}>
				<h2 className={SECTION_HEAD}>Academic Information</h2>
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
			<div className={SECTION_CARD}>
				<h2 className={SECTION_HEAD}>Team Preferences</h2>
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
			<div className={SECTION_CARD}>
				<h2 className={SECTION_HEAD}>Resume / CV</h2>
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
							<UploadIcon size={12} />
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
						<SendIcon size={14} />
					</>
				)}
			</button>
		</form>
	);
}

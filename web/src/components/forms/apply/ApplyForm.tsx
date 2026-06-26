"use client";

import { POSITION_OPTIONS, YEAR_OPTIONS } from "@/components/pagecomponents/apply/constants";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { SectionTitle } from "@/components/ui/components/SectionTitle";
import { Select } from "@/components/ui/components/Select";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import { useApplyForm } from "@/hooks/apply/useApplyForm";

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
			className="flex flex-col gap-8"
		>
			{state.status === "success" && (
				<div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm flex items-center gap-2">
					<i className="fas fa-check-circle" aria-hidden="true" />
					{state.message}
				</div>
			)}
			{state.status === "error" && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
					<i className="fas fa-exclamation-circle" aria-hidden="true" />
					{state.message}
				</div>
			)}

			{/* Personal Info */}
			<div className="bg-bg-panel rounded-2xl border border-gray-mid p-6">
				<SectionTitle icon="fas fa-user" title="Personal Information" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Field
						label="First Name"
						htmlFor="firstName"
						error={state.errors?.firstName}
					>
						<Input id="firstName" type="text" name="firstName" required />
					</Field>
					<Field
						label="Last Name"
						htmlFor="lastName"
						error={state.errors?.lastName}
					>
						<Input id="lastName" type="text" name="lastName" required />
					</Field>
					<Field
						label="Email Address"
						htmlFor="email"
						error={state.errors?.email}
					>
						<Input id="email" type="email" name="email" required />
					</Field>
					<Field
						label="Phone Number"
						htmlFor="phone"
						error={state.errors?.phone}
					>
						<Input id="phone" type="tel" name="phone" required />
					</Field>
				</div>
			</div>

			{/* Academic Info */}
			<div className="bg-bg-panel rounded-2xl border border-gray-mid p-6">
				<SectionTitle icon="fas fa-university" title="Academic Information" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Field
						label="Student ID"
						htmlFor="studentId"
						error={state.errors?.studentId}
					>
						<Input id="studentId" type="text" name="studentId" required />
					</Field>
					<Field
						label="Faculty"
						htmlFor="faculty"
						error={state.errors?.faculty}
					>
						<Input id="faculty" type="text" name="faculty" required />
					</Field>
					<Field label="Major" htmlFor="major" error={state.errors?.major}>
						<Input id="major" type="text" name="major" required />
					</Field>
					<Field
						label="GPA (6.00 – 10.00)"
						htmlFor="gpa"
						error={state.errors?.gpa}
					>
						<Input
							id="gpa"
							type="number"
							name="gpa"
							step="0.01"
							min="6"
							max="10"
							required
						/>
					</Field>
					<Field
						label="Academic Year"
						htmlFor="academic_year"
						error={state.errors?.academic_year}
					>
						<Select
							id="academic_year"
							name="academic_year"
							options={YEAR_OPTIONS}
							placeholder="Select Year"
							value={academicYear}
							onChange={setAcademicYear}
							required
						/>
					</Field>
					<Field
						label="Years Currently Studying"
						htmlFor="years_studying"
						error={state.errors?.years_studying}
					>
						<Input
							id="years_studying"
							type="number"
							name="years_studying"
							min="1"
							max="10"
							placeholder="e.g. 3"
							required
						/>
					</Field>
				</div>
			</div>

			{/* Team Preferences */}
			<div className="bg-bg-panel rounded-2xl border border-gray-mid p-6">
				<SectionTitle icon="fas fa-flag-checkered" title="Team Preferences" />
				<div className="flex flex-col gap-4">
					<Field
						label="Desired Position"
						htmlFor="position"
						error={state.errors?.position}
					>
						<Select
							id="position"
							name="position"
							options={POSITION_OPTIONS}
							placeholder="Select department"
							value={position}
							onChange={setPosition}
							required
						/>
					</Field>
					<Field
						label="Relevant Experience (optional)"
						htmlFor="experience"
						error={state.errors?.experience}
					>
						<Textarea id="experience" name="experience" rows={3} />
					</Field>
					<Field
						label="Why do you want to join our team?"
						htmlFor="motivation"
						error={state.errors?.motivation}
					>
						<Textarea id="motivation" name="motivation" rows={5} required />
					</Field>
				</div>
			</div>

			{/* Resume */}
			<div className="bg-bg-panel rounded-2xl border border-gray-mid p-6">
				<SectionTitle icon="fas fa-file-pdf" title="Resume / CV" />
				<Field
					label="Resume (PDF only · max 5MB)"
					htmlFor="resume"
					error={state.errors?.resume}
				>
					<div className="flex items-center gap-3">
						<label
							htmlFor="resume"
							className="cursor-pointer px-4 py-2.5 rounded-lg border border-primary text-primary text-sm font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors"
						>
							Choose File
						</label>
						<span className="text-text-gray text-sm">{fileName}</span>
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
				</Field>
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

			<SubmitButton
				pending={pending}
				label="Submit Application"
				pendingLabel="Submitting…"
				icon="fas fa-paper-plane"
			/>
		</form>
	);
}

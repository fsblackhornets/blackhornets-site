"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import type { Post } from "@/types/post";

interface PostFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	post?: Post;
}

export function PostForm({ action, post }: PostFormProps) {
	const [state, formAction, pending] = useActionState(action, {});

	return (
		<form action={formAction} className="flex flex-col gap-5 max-w-[720px]">
			{state.error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
					{state.error}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<Field label="Title (Serbian) *" htmlFor="title_sr">
					<Input
						id="title_sr"
						name="title_sr"
						required
						defaultValue={post?.title_sr ?? ""}
					/>
				</Field>
				<Field label="Title (English)" htmlFor="title_en">
					<Input
						id="title_en"
						name="title_en"
						defaultValue={post?.title_en ?? ""}
					/>
				</Field>
			</div>

			<Field label="Content (Serbian) *" htmlFor="content_sr">
				<Textarea
					id="content_sr"
					name="content_sr"
					rows={10}
					required
					defaultValue={post?.content_sr ?? ""}
				/>
			</Field>

			<Field label="Content (English)" htmlFor="content_en">
				<Textarea
					id="content_en"
					name="content_en"
					rows={10}
					defaultValue={post?.content_en ?? ""}
				/>
			</Field>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<Field label="Category" htmlFor="category">
					<Input
						id="category"
						name="category"
						placeholder="e.g. News"
						defaultValue={post?.category ?? ""}
					/>
				</Field>
				<Field label="Author" htmlFor="author">
					<Input id="author" name="author" defaultValue={post?.author ?? ""} />
				</Field>
			</div>

			{post && (
				<Field label="Status" htmlFor="status">
					<select
						id="status"
						name="status"
						defaultValue={post.status}
						className="bg-bg-dark border border-gray-mid rounded-lg px-4 py-2.5 text-text-light outline-none focus:border-primary transition-colors text-sm w-full"
					>
						<option value="published">Published</option>
						<option value="draft">Draft</option>
					</select>
				</Field>
			)}

			<label className="flex items-center gap-3 text-text-gray text-sm cursor-pointer">
				<input
					type="checkbox"
					name="featured"
					value="1"
					defaultChecked={post?.featured === 1}
					className="w-4 h-4 accent-primary"
				/>
				Featured post
			</label>

			<SubmitButton
				pending={pending}
				label={post ? "Save Changes" : "Publish Post"}
				pendingLabel={post ? "Saving…" : "Publishing…"}
				icon="fas fa-save"
				className="self-start px-8"
			/>
		</form>
	);
}

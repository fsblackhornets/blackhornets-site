import { useEffect, useRef, useState } from "react";
import { buildProjectImageUrl } from "@/lib/utils/utils";
import type { Project } from "@/types/project";

interface PreviewState {
	name: string;
	description: string;
	status: string;
	due_date: string;
	duration: string;
}

export function useProjectFormPreview(project?: Project) {
	const [fileName, setFileName] = useState("No file chosen");
	const [progress, setProgress] = useState(project?.progress ?? 0);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		project?.image ? buildProjectImageUrl(project.image) : null,
	);
	const [preview, setPreview] = useState<PreviewState>({
		name: project?.name ?? "",
		description: project?.description ?? "",
		status: project?.status ?? "Active",
		due_date: project?.due_date?.slice(0, 10) ?? "",
		duration: project?.duration ?? "",
	});
	const objectUrlRef = useRef<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	const syncPreview = () => {
		const form = formRef.current;
		if (!form) return;
		const data = new FormData(form);
		setPreview({
			name: (data.get("name") as string) ?? "",
			description: (data.get("description") as string) ?? "",
			status: (data.get("status") as string) ?? "Active",
			due_date: (data.get("due_date") as string) ?? "",
			duration: (data.get("duration") as string) ?? "",
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setFileName(file?.name ?? "No file chosen");
		if (!file) return;
		if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setPreviewUrl(url);
	};

	return {
		formRef,
		fileName,
		handleFileChange,
		previewUrl,
		progress,
		setProgress,
		preview,
		syncPreview,
	};
}

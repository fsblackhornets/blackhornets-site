import { useEffect, useRef, useState } from "react";
import type { ProjectStatus } from "@/constants/projects";
import type { SponsorTier } from "@/constants/sponsors";

export function useRequestPostPreview() {
	const [titleSr, setTitleSr] = useState("");
	const [contentSr, setContentSr] = useState("");
	const [category, setCategory] = useState("");
	const [imageFile, setImageFile] = useState<string | null>(null);
	return {
		titleSr,
		setTitleSr,
		contentSr,
		setContentSr,
		category,
		setCategory,
		imageFile,
		setImageFile,
	};
}

export function useRequestProjectPreview() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<ProjectStatus>("Active");
	const [dueDate, setDueDate] = useState("");
	const [duration, setDuration] = useState("");
	const [progress, setProgress] = useState(0);
	const [imageFile, setImageFile] = useState<string | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setImageFile(file?.name ?? null);
		if (!file) return;
		if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setImagePreviewUrl(url);
	};

	return {
		name,
		setName,
		description,
		setDescription,
		status,
		setStatus,
		dueDate,
		setDueDate,
		duration,
		setDuration,
		progress,
		setProgress,
		imageFile,
		imagePreviewUrl,
		handleImageChange,
	};
}

export function useRequestSponsorPreview() {
	const [name, setName] = useState("");
	const [tier, setTier] = useState<SponsorTier>("F4 - Bronze");
	const [website, setWebsite] = useState("");
	const [descSr, setDescSr] = useState("");
	const [logoFile, setLogoFile] = useState<string | null>(null);
	const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setLogoFile(file?.name ?? null);
		if (!file) return;
		if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setLogoPreviewUrl(url);
	};

	return {
		name,
		setName,
		tier,
		setTier,
		website,
		setWebsite,
		descSr,
		setDescSr,
		logoFile,
		logoPreviewUrl,
		handleLogoChange,
	};
}

export function useRequestMemberPreview() {
	const [fullName, setFullName] = useState("");
	const [position, setPosition] = useState("");
	const [team, setTeam] = useState("");
	const [role, setRole] = useState("team_member");
	const [imageFile, setImageFile] = useState<string | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setImageFile(file?.name ?? null);
		if (!file) return;
		if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setImagePreviewUrl(url);
	};

	return {
		fullName,
		setFullName,
		position,
		setPosition,
		team,
		setTeam,
		role,
		setRole,
		imageFile,
		imagePreviewUrl,
		handleImageChange,
	};
}

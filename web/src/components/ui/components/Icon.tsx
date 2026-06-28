export type IconName =
	| "calendar"
	| "clock"
	| "eye"
	| "user"
	| "users"
	| "location"
	| "email"
	| "phone"
	| "send"
	| "download"
	| "external-link"
	| "arrow-left"
	| "chevron-left"
	| "chevron-right"
	| "chevron-down"
	| "chevron-up"
	| "check"
	| "check-circle"
	| "alert-circle"
	| "close"
	| "search"
	| "facebook"
	| "instagram"
	| "linkedin"
	| "youtube"
	| "file-pdf"
	| "gear"
	| "clipboard"
	| "sitemap"
	| "bolt"
	| "star";

interface IconProps {
	name: IconName;
	size?: number;
	stroke?: string;
	strokeWidth?: number;
	className?: string;
}

const PATHS: Record<IconName, React.ReactNode> = {
	calendar: (
		<>
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</>
	),
	eye: (
		<>
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" />
		</>
	),
	user: (
		<>
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</>
	),
	users: (
		<>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	location: (
		<>
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</>
	),
	email: (
		<>
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
			<polyline points="22,6 12,13 2,6" />
		</>
	),
	phone: (
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.07 3.5 2 2 0 0 1 3 1.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
	),
	send: (
		<>
			<line x1="22" y1="2" x2="11" y2="13" />
			<polygon points="22 2 15 22 11 13 2 9 22 2" />
		</>
	),
	download: (
		<>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</>
	),
	"external-link": (
		<>
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			<polyline points="15 3 21 3 21 9" />
			<line x1="10" y1="14" x2="21" y2="3" />
		</>
	),
	"arrow-left": (
		<>
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</>
	),
	"chevron-left": <polyline points="15 18 9 12 15 6" />,
	"chevron-right": <polyline points="9 18 15 12 9 6" />,
	"chevron-down": <polyline points="6 9 12 15 18 9" />,
	"chevron-up": <polyline points="18 15 12 9 6 15" />,
	check: <polyline points="20 6 9 17 4 12" />,
	"check-circle": (
		<>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</>
	),
	"alert-circle": (
		<>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</>
	),
	close: (
		<>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</>
	),
	search: (
		<>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</>
	),
	facebook: (
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	),
	instagram: (
		<>
			<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
		</>
	),
	linkedin: (
		<>
			<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
			<rect x="2" y="9" width="4" height="12" />
			<circle cx="4" cy="4" r="2" />
		</>
	),
	youtube: (
		<>
			<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
			<polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
		</>
	),
	"file-pdf": (
		<>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</>
	),
	gear: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</>
	),
	clipboard: (
		<>
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
			<rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
		</>
	),
	sitemap: (
		<>
			<rect x="3" y="3" width="7" height="7" />
			<rect x="14" y="3" width="7" height="7" />
			<rect x="14" y="14" width="7" height="7" />
			<rect x="3" y="14" width="7" height="7" />
		</>
	),
	bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
	star: (
		<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
	),
};

export function Icon({
	name,
	size = 16,
	stroke = "currentColor",
	strokeWidth = 1.5,
	className,
}: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			style={{ width: size, height: size, flexShrink: 0 }}
		>
			{PATHS[name]}
		</svg>
	);
}

// Named exports — backwards compatible wrappers
export function CalendarIcon({ className }: { className?: string }) {
	return <Icon name="calendar" strokeWidth={2} className={className} />;
}
export function ClockIcon({ className }: { className?: string }) {
	return <Icon name="clock" strokeWidth={2} className={className} />;
}
export function SearchIcon({ className }: { className?: string }) {
	return <Icon name="search" strokeWidth={2} className={className} />;
}
export function UserIcon({ className }: { className?: string }) {
	return <Icon name="user" strokeWidth={2} className={className} />;
}

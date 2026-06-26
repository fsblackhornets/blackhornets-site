import { Gauge } from "lucide-react";
export function SpeedIcon({ className }: { className?: string }) {
	return <Gauge className={className} aria-hidden="true" />;
}

import { Loader2 } from "lucide-react";
import type { SVGProps } from "react";

export function SpinnerIcon({ className = "", ...props }: SVGProps<SVGSVGElement>) {
	return <Loader2 aria-label="Loading" role="status" className={`animate-spin ${className}`} {...(props as object)} />;
}

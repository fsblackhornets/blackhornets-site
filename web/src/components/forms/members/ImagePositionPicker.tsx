"use client";

interface ImagePositionPickerProps {
	imageUrl: string | null;
	value: string;
	onChange: (value: string) => void;
}

function parsePosition(value: string): { x: number; y: number } {
	const [xStr, yStr] = value.split(" ");
	const x = Number.parseInt(xStr, 10);
	const y = Number.parseInt(yStr, 10);
	return {
		x: Number.isFinite(x) ? x : 50,
		y: Number.isFinite(y) ? y : 50,
	};
}

export function ImagePositionPicker({
	imageUrl,
	value,
	onChange,
}: ImagePositionPickerProps) {
	if (!imageUrl) return null;
	const { x, y } = parsePosition(value);

	return (
		<div className="flex items-center gap-4">
			<div className="w-20 h-20 rounded-full overflow-hidden border border-primary/30 bg-bg-dark shrink-0">
				{/* biome-ignore lint/performance/noImgElement: needs raw object-position control for the live crop preview */}
				<img
					src={imageUrl}
					alt="Crop preview"
					className="w-full h-full object-cover"
					style={{ objectPosition: `${x}% ${y}%` }}
				/>
			</div>
			<div className="flex-1 flex flex-col gap-2.5">
				<label className="flex items-center gap-2">
					<span className="font-heading text-[7px] tracking-[2px] uppercase text-[#444] w-16 shrink-0">
						Horizontal
					</span>
					<input
						type="range"
						min={0}
						max={100}
						value={x}
						onChange={(e) => onChange(`${e.target.value}% ${y}%`)}
						className="flex-1 accent-primary"
					/>
				</label>
				<label className="flex items-center gap-2">
					<span className="font-heading text-[7px] tracking-[2px] uppercase text-[#444] w-16 shrink-0">
						Vertical
					</span>
					<input
						type="range"
						min={0}
						max={100}
						value={y}
						onChange={(e) => onChange(`${x}% ${e.target.value}%`)}
						className="flex-1 accent-primary"
					/>
				</label>
			</div>
		</div>
	);
}

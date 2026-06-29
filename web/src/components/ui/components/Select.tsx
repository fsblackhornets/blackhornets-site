"use client";

import * as RadixSelect from "@radix-ui/react-select";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	id?: string;
	name: string;
	options: readonly SelectOption[];
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	required?: boolean;
}

export function Select({
	id,
	name,
	options,
	placeholder = "Select…",
	value,
	onChange,
	required,
}: SelectProps) {
	return (
		<div className="relative">
			{/* Hidden input for FormData / Server Actions */}
			<input type="hidden" name={name} value={value} required={required} />

			<RadixSelect.Root value={value} onValueChange={onChange}>
				<RadixSelect.Trigger
					id={id}
					className="w-full flex items-center justify-between bg-[#0e0e0e] border border-[#2a2a2a] rounded-none px-3 py-2.5 text-[10px] font-body text-[#e0e0e0] outline-none focus:border-primary data-[placeholder]:text-[#333] transition-colors appearance-none"
				>
					<RadixSelect.Value placeholder={placeholder} />
					<RadixSelect.Icon>
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#444"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</RadixSelect.Icon>
				</RadixSelect.Trigger>

				<RadixSelect.Portal>
					<RadixSelect.Content
						className="z-50 bg-bg-panel border border-[#2a2a2a] rounded-sm shadow-xl overflow-hidden"
						position="popper"
						sideOffset={4}
					>
						<RadixSelect.Viewport className="p-1">
							{options.map(({ value: v, label }) => (
								<RadixSelect.Item
									key={v}
									value={v}
									className="flex items-center justify-between px-3 py-2 text-[10px] font-body text-[#e0e0e0] cursor-pointer outline-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:text-primary"
								>
									<RadixSelect.ItemText>{label}</RadixSelect.ItemText>
									<RadixSelect.ItemIndicator>
										<svg
											width="10"
											height="10"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</RadixSelect.ItemIndicator>
								</RadixSelect.Item>
							))}
						</RadixSelect.Viewport>
					</RadixSelect.Content>
				</RadixSelect.Portal>
			</RadixSelect.Root>
		</div>
	);
}

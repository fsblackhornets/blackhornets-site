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
					className="w-full flex items-center justify-between bg-bg-dark border border-gray-mid rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary data-[placeholder]:text-text-gray text-text-light transition-colors hover:border-primary/50"
				>
					<RadixSelect.Value placeholder={placeholder} />
					<RadixSelect.Icon>
						<i
							className="fas fa-chevron-down text-text-gray text-xs"
							aria-hidden="true"
						/>
					</RadixSelect.Icon>
				</RadixSelect.Trigger>

				<RadixSelect.Portal>
					<RadixSelect.Content
						className="z-50 bg-bg-panel border border-gray-mid rounded-xl shadow-xl overflow-hidden"
						position="popper"
						sideOffset={4}
					>
						<RadixSelect.Viewport className="p-1">
							{options.map(({ value: v, label }) => (
								<RadixSelect.Item
									key={v}
									value={v}
									className="flex items-center justify-between px-4 py-2.5 text-sm text-text-light rounded-lg cursor-pointer outline-none
										data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary
										data-[state=checked]:text-primary"
								>
									<RadixSelect.ItemText>{label}</RadixSelect.ItemText>
									<RadixSelect.ItemIndicator>
										<i
											className="fas fa-check text-xs text-primary"
											aria-hidden="true"
										/>
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

"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";

export interface AccordionItem {
	question: string;
	answer: string;
}

export function Accordion({ items }: { items: readonly AccordionItem[] }) {
	return (
		<RadixAccordion.Root
			type="single"
			collapsible
			className="flex flex-col gap-3"
		>
			{items.map(({ question, answer }) => (
				<RadixAccordion.Item
					key={question}
					value={question}
					className="group bg-bg-panel border border-primary/30 rounded-xl overflow-hidden data-[state=open]:border-primary/60 transition-colors"
				>
					<RadixAccordion.Header>
						<RadixAccordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-left text-text-light text-sm font-semibold cursor-pointer outline-none">
							{question}
							<span
								className="text-primary text-lg leading-none shrink-0 ml-4 group-data-[state=closed]:block group-data-[state=open]:hidden"
								aria-hidden="true"
							>
								+
							</span>
							<span
								className="text-primary text-lg leading-none shrink-0 ml-4 group-data-[state=open]:block group-data-[state=closed]:hidden"
								aria-hidden="true"
							>
								×
							</span>
						</RadixAccordion.Trigger>
					</RadixAccordion.Header>
					<RadixAccordion.Content className="px-5 pb-4 pt-2 text-text-gray text-sm leading-relaxed border-t border-primary/10 data-[state=open]:animate-[accordionOpen_150ms_ease] data-[state=closed]:animate-[accordionClose_150ms_ease] overflow-hidden">
						{answer}
					</RadixAccordion.Content>
				</RadixAccordion.Item>
			))}
		</RadixAccordion.Root>
	);
}

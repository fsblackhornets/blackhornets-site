import { Accordion } from "@/components/ui/components/Accordion";
import { FAQS } from "./constants";

export function FaqSection() {
	return (
		<section className="py-20 px-4 max-w-[900px] mx-auto">
			<h2 className="font-heading text-[clamp(1.8rem,4vw,2.5rem)] uppercase tracking-[3px] text-primary mb-10 text-center">
				Frequently Asked Questions
			</h2>
			<Accordion items={FAQS.map(({ q, a }) => ({ question: q, answer: a }))} />
		</section>
	);
}

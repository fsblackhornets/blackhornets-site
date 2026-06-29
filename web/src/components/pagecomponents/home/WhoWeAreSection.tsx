export function WhoWeAreSection() {
	return (
		<section className="my-20 max-w-screen-2xl mx-auto px-4">
			{/* Heading */}
			<div className="text-center mb-12">
				<h2
					className="font-heading uppercase text-text-light"
					style={{
						fontSize: "clamp(2rem, 6vw, 3.5rem)",
						letterSpacing: "0.2em",
					}}
				>
					Who We Are
				</h2>
				<div
					style={{
						width: "64px",
						height: "2px",
						background: "#ffd700",
						margin: "12px auto 0",
					}}
				/>
			</div>

			{/* Quote block */}
			<div
				className="relative mb-10"
				style={{
					borderTop: "3px solid #ffd700",
					borderRight: "1px solid rgba(255,215,0,0.3)",
					borderBottom: "1px solid rgba(255,215,0,0.3)",
					borderLeft: "1px solid rgba(255,215,0,0.3)",
					background: "rgba(255,215,0,0.03)",
					padding: "3rem 2.5rem 2rem",
				}}
			>
				{/* " badge sitting on top border */}
				<span
					className="font-heading font-black text-primary absolute"
					aria-hidden="true"
					style={{
						top: "-1.8rem",
						left: "2rem",
						fontSize: "5rem",
						lineHeight: 1,
						background: "#111111",
						padding: "0 0.25rem",
					}}
				>
					&ldquo;
				</span>
				<p
					className="font-body italic text-text-light leading-[1.9]"
					style={{ fontSize: "1.15rem" }}
				>
					Mi ne gradimo samo automobile – mi gradimo budućnost trkanja.
				</p>
			</div>

			{/* 2-col text grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<p className="font-body text-text-gray leading-[1.8]">
					Black Hornets Racing je strastven tim studenata inženjerstva posvećen
					pomeranju granica automobilske inovacije. Kombinujemo najsavremeniju
					tehnologiju sa održivim praksama kako bismo stvorili trkačka vozila
					visokih performansi koja predstavljaju budućnost auto-moto sporta.
				</p>
				<p className="font-body text-text-gray leading-[1.8]">
					Naš tim okuplja raznolike talente iz oblasti mašinstva,
					elektroinženjeringa, aerodinamike i analize podataka. Verujemo u
					učenje kroz praktično iskustvo, takmičenje na međunarodnim
					nadmetanjima i razvoj rešenja koja odgovaraju na realne izazove
					automobilske industrije.
				</p>
			</div>
		</section>
	);
}

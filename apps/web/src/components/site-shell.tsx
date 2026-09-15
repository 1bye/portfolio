export const SiteShell = () => (
	<main
		className="min-h-svh px-4 py-4 sm:px-6 sm:py-6"
		id="main-content"
		tabIndex={-1}
	>
		<div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-[90rem] flex-col border border-[var(--line)] bg-[var(--surface)] sm:min-h-[calc(100svh-3rem)]">
			<header className="flex items-center justify-between border-[var(--line)] border-b px-5 py-4 sm:px-8">
				<a
					aria-label="Yurii Hulyk, home"
					className="font-semibold text-sm tracking-[-0.03em]"
					href="/"
				>
					YH
				</a>
				<p className="font-mono text-[0.6875rem] text-[var(--muted)] uppercase tracking-[0.16em]">
					Portfolio / 02
				</p>
			</header>

			<section
				aria-labelledby="intro-title"
				className="grid flex-1 content-center gap-7 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)] lg:items-end lg:gap-16"
			>
				<div>
					<p className="mb-5 font-mono text-[0.6875rem] text-[var(--accent)] uppercase tracking-[0.16em]">
						New portfolio in progress
					</p>
					<h1
						className="max-w-4xl text-balance font-medium text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.84] tracking-[-0.075em]"
						id="intro-title"
					>
						A new frame for better work.
					</h1>
				</div>

				<p className="max-w-md text-pretty text-[var(--muted)] text-base leading-7 sm:text-lg">
					My experience has grown. This space is being rebuilt to match it—
					clearer, more personal, and focused on the work that matters.
				</p>
			</section>

			<footer className="flex items-center justify-between gap-4 border-[var(--line)] border-t px-5 py-4 text-sm sm:px-8">
				<p className="text-[var(--muted)]">Software engineer</p>
				<a className="text-link" href="mailto:hi@1bye.dev">
					Say hello
				</a>
			</footer>
		</div>
	</main>
);

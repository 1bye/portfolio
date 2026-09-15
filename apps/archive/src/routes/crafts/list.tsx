import { createFileRoute } from "@tanstack/react-router";
import { RevealProvider } from "@/components/reveal/provider";
import { RevealLink } from "@/components/reveal/reveal-link";
import { RevealText } from "@/components/reveal/reveal-text";
import SiteHeader from "@/components/site-header";

export const Route = createFileRoute("/crafts/list")({
	component: CraftsComponent,
	head: () => ({
		meta: [
			{ title: "Crafts — 1bye" },
			{
				name: "description",
				content: "Experiments and creative tools by Yurii Hulyk.",
			},
		],
	}),
});

interface Craft {
	category: string;
	description: string;
	title: string;
	to: string;
}

const crafts: Craft[] = [
	{
		title: "Ordered Dither",
		description:
			"Upload an image or GIF and apply ordered dithering with real-time configuration.",
		to: "/crafts/dither",
		category: "Shader",
	},
];

function CraftsComponent() {
	return (
		<RevealProvider delay={0}>
			<div className="relative z-10 mx-auto md:max-w-2xl *:[[id]]:scroll-mt-22">
				<SiteHeader />
				<div className="w-full pt-8" />
				<section className="flex flex-col gap-3">
					<div className="flex flex-row items-center justify-between">
						<RevealText>Crafts</RevealText>
						<RevealText className="text-muted-foreground text-sm italic">
							Experiments and creative tools
						</RevealText>
					</div>

					<div className="flex flex-col gap-4">
						{crafts.map((craft) => (
							<CraftItem key={craft.to} {...craft} />
						))}
					</div>
				</section>
			</div>
		</RevealProvider>
	);
}

function CraftItem({ title, description, to, category }: Craft) {
	return (
		<RevealLink className="group flex flex-col gap-1" to={to}>
			<div className="flex flex-row items-center gap-1">
				<RevealText className="group-hover:underline">{title}</RevealText>
				{category && (
					<RevealText className="mt-1 flex whitespace-nowrap font-mono text-muted-foreground/50 text-xs italic">
						{`# ${category}`}
					</RevealText>
				)}
			</div>
			<RevealText className="text-muted-foreground text-sm">
				{description}
			</RevealText>
		</RevealLink>
	);
}

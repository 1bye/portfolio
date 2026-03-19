import { RevealText } from "@/components/reveal/reveal-text";

export function ProfileBlock() {
	return (
		<section className="flex w-full flex-col gap-4">
			<RevealText>I like to do crazy decisions, cook and be funny</RevealText>

			<RevealText className="text-muted-foreground text-sm">
				I'm self aware guy, that every time try to make something DIFFERENT.
				Starting from my thoughts and ending with action. So don't expect me to
				be consistent. I'm a developer that can make absolutely anything. Now
				I'm trying to focus more on learning new stuff about entrepreneurship,
				buisness, people and startups.
			</RevealText>

			<RevealText className="text-muted-foreground text-sm">
				Let's get deeper into my thoughts and actions.
			</RevealText>
		</section>
	);
}

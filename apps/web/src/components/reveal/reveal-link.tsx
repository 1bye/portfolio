import { Link, useLocation, useRouter } from "@tanstack/react-router";
import type { ComponentProps, MouseEvent } from "react";
import { useCallback } from "react";
import { useReveal } from "./provider";

type RevealLinkProps = ComponentProps<typeof Link>;

export function RevealLink({ onClick, ...props }: RevealLinkProps) {
	const { leave } = useReveal();
	const router = useRouter();
	const pathname = useLocation({ select: (l) => l.pathname });

	const handleClick = useCallback(
		(e: MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();

			const href = typeof props.to === "string" ? props.to : "/";
			if (href === pathname) {
				return;
			}

			onClick?.(e as never);

			leave()
				.then(() => router.navigate({ to: href }))
				.catch(() => undefined);
		},
		[leave, router, props.to, onClick, pathname]
	);

	return <Link {...props} onClick={handleClick} />;
}

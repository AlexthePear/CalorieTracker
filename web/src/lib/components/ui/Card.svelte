<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		bordered?: boolean;
		compact?: boolean;
	};

	let { class: className, bordered = true, compact = false, ...restProps }: Props = $props();
</script>

<div
	class={cn('card bg-base-100 shadow-xl', bordered && 'card-bordered', compact && 'card-compact', className)}
	{...restProps}
>
	<slot />
</div>

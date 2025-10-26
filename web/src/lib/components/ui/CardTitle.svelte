<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
	};

	let { class: className, ...restProps }: Props = $props();
</script>

<div data-slot="card-title" class={cn('leading-none font-semibold', className)} {...restProps}>
	<slot />
</div>

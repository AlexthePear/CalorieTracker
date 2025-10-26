<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'error' | 'success' | 'warning' | 'info';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		outline?: boolean;
		class?: string;
	};

	let {
		variant = 'primary',
		size = 'md',
		outline = false,
		class: className,
		...restProps
	}: Props = $props();

	const variantClasses = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		accent: 'btn-accent',
		ghost: 'btn-ghost',
		link: 'btn-link',
		error: 'btn-error',
		success: 'btn-success',
		warning: 'btn-warning',
		info: 'btn-info'
	};

	const sizeClasses = {
		xs: 'btn-xs',
		sm: 'btn-sm',
		md: 'btn-md',
		lg: 'btn-lg'
	};
</script>

<button
	class={cn('btn', variantClasses[variant], sizeClasses[size], outline && 'btn-outline', className)}
	{...restProps}
>
	<slot />
</button>

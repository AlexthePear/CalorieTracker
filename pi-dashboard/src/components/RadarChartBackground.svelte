<script lang="ts">
	export let cx: number;
	export let cy: number;
	export let maxRadius: number;
	export let numCircles: number = 4;
	export let strokeColor: string = 'lightgrey';
	export let strokeWidth: number = 1;

	$: circleStep = maxRadius / numCircles;
</script>

<!-- Background concentric circles -->
{#each Array(numCircles) as _, i}
	<circle
		cx={cx}
		cy={cy}
		r={maxRadius - i * circleStep}
		fill="none"
		stroke={strokeColor}
		stroke-width={strokeWidth}
	/>
{/each}

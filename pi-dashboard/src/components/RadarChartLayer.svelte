<script lang="ts">
	import { calculateDataPoints } from '$lib/radarChartUtils';
	import type { Metric } from '$lib/radarChartUtils';

	export let metrics: Metric[];
	export let maxRadius: number;
	export let cx: number;
	export let cy: number;
	export let strokeColor: string = 'rgb(59, 130, 246)';
	export let fillColor: string = 'rgba(59, 130, 246, 0.3)';
	export let strokeWidth: number = 2;
	export let showPoints: boolean = true;
	$: dataPoints = calculateDataPoints(metrics, maxRadius, cx, cy);
</script>

<!-- Radar chart polygon - connect data points with straight lines -->
{#each dataPoints as point, i}
	{@const nextPoint = dataPoints[(i + 1) % dataPoints.length]}
	<line
		x1={point.x}
		y1={point.y}
		x2={nextPoint.x}
		y2={nextPoint.y}
		stroke={strokeColor}
		stroke-width={strokeWidth}
	/>
{/each}

<!-- Fill polygon -->
<polygon points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')} fill={fillColor} stroke="none" />

<!-- Data points -->
{#if showPoints}
	{#each dataPoints as point}
		<circle cx={point.x} cy={point.y} r="4" fill={strokeColor} />
	{/each}
{/if}

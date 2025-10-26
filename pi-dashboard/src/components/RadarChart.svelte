<script lang="ts">
	import type { Metric } from '$lib/radarChartUtils';
	import { goal_data } from '$lib/radarChartUtils';
	import RadarChartBackground from './RadarChartBackground.svelte';
	import RadarChartAxes from './RadarChartAxes.svelte';
	import RadarChartLayer from './RadarChartLayer.svelte';

	// Chart configuration
	export let size: number = 500;
	export let maxRadius: number = 200;
	export let numCircles: number = 4;

	export let daily_data: Metric[] | undefined = undefined;

	daily_data = [
		{ metric_name: 'calories', metric_score: 1200 },
		{ metric_name: 'protein', metric_score: 110 },
		{ metric_name: 'carbs', metric_score: 40 },
		{ metric_name: 'fats', metric_score: 80 },
		{ metric_name: 'sugar', metric_score: 20 },
		{ metric_name: 'fiber', metric_score: 12 },
		{ metric_name: 'satiety', metric_score: 55 }
	];
	// Layer styling
	export let goalStrokeColor: string = 'rgb(59, 130, 246)';
	export let goalFillColor: string = 'rgba(59, 130, 246, 0.3)';
	export let dailyStrokeColor: string = 'rgb(34, 197, 94)';
	export let dailyFillColor: string = 'rgba(34, 197, 94, 0.3)';

	$: cx = size / 2;
	$: cy = size / 2;
</script>

<svg width={size} height={size}>
	<!-- Background concentric circles -->
	<RadarChartBackground {cx} {cy} {maxRadius} {numCircles} />

	<!-- Radar chart axes -->
	<RadarChartAxes metrics={goal_data} {cx} {cy} {maxRadius} />

	<!-- Radar chart layer for daily data (if provided) -->
	{#if daily_data}
		<RadarChartLayer
			metrics={daily_data}
			{maxRadius}
			{cx}
			{cy}
			strokeColor={dailyStrokeColor}
			fillColor={dailyFillColor}
		/>
	{/if}
</svg>

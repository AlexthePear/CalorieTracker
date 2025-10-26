<script lang="ts">
	import type { Metric } from '$lib/radarChartUtils';
	import { goal_data } from '$lib/radarChartUtils';
	import RadarChartBackground from './RadarChartBackground.svelte';
	import RadarChartAxes from './RadarChartAxes.svelte';
	import RadarChartLayer from './RadarChartLayer.svelte';

	export let size: number = 360;
	export let maxRadius: number = 120;
	export let numCircles: number = 4;

	let daily_data: Metric[] = [
		{ metric_name: 'calories', metric_score: 990 },
		{ metric_name: 'protein', metric_score: 42 },
		{ metric_name: 'carbs', metric_score: 40 },
		{ metric_name: 'fats', metric_score: 21 },
		{ metric_name: 'sugar', metric_score: 4 },
		{ metric_name: 'fiber', metric_score: 12 },
		{ metric_name: 'satiety', metric_score: 45 }
	];

	export let goalStrokeColor: string = 'rgb(59, 36, 246)';
	export let goalFillColor: string = 'rgba(169, 169, 169, 0.5)';
	export let dailyStrokeColor: string = 'rgb(34, 197, 94)';
	export let dailyFillColor: string = 'rgba(34, 197, 94, 0.3)';

	$: cx = size / 2;
	$: cy = size / 2;
	function increaseDailyScores() {
		daily_data = [
			{ metric_name: 'calories', metric_score: 1400 },
			{ metric_name: 'protein', metric_score: 90 },
			{ metric_name: 'carbs', metric_score: 87 },
			{ metric_name: 'fats', metric_score: 49 },
			{ metric_name: 'sugar', metric_score: 1 },
			{ metric_name: 'fiber', metric_score: 12 },
			{ metric_name: 'satiety', metric_score: 20 }
		];
	}
</script>

<svg width={size} height={size} on:mouseenter={() => increaseDailyScores(0.2)}>
	<RadarChartBackground {cx} {cy} {maxRadius} numCircles={4}></RadarChartBackground>
	<RadarChartAxes metrics={goal_data} {cx} {cy} {maxRadius} />
	<RadarChartLayer
		metrics={goal_data}
		{maxRadius}
		{cx}
		{cy}
		strokeColor={goalStrokeColor}
		fillColor={goalFillColor}
	></RadarChartLayer>
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

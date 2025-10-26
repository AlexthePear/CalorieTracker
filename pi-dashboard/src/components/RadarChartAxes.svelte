<script lang="ts">
	import { polarToCartesian } from '$lib/radarChartUtils';
	import type { Metric } from '$lib/radarChartUtils';

	export let metrics: Metric[];
	export let cx: number;
	export let cy: number;
	export let maxRadius: number;
	export let axisStrokeColor: string = 'lightgrey';
	export let axisStrokeWidth: number = 1;
	export let showLabels: boolean = true;
	export let labelOffset: number = 30;
	export let labelFontSize: number = 14;

	$: numMetrics = metrics.length;
</script>

<!-- Radar chart axes -->
{#each metrics as metric, i (metric)}
	{@const point = polarToCartesian(maxRadius, i, numMetrics, cx, cy)}
	<line
		x1={cx}
		y1={cy}
		x2={point.x}
		y2={point.y}
		stroke={axisStrokeColor}
		stroke-width={axisStrokeWidth}
	/>
	{#if showLabels}
		{@const labelPoint = polarToCartesian(maxRadius + labelOffset, i, numMetrics, cx, cy)}
		<text
			x={labelPoint.x}
			y={labelPoint.y}
			text-anchor="middle"
			dominant-baseline="middle"
			font-size={labelFontSize}
		>
			{metric.metric_name}
		</text>
	{/if}
{/each}

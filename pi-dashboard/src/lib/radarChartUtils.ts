export type MetricsData = {
  calories: Metric;
  protein: Metric;
  carbs: Metric;
  fats: Metric;
  sugar: Metric;
  fiber: Metric;
  satiety: Metric;
}
export type Metric = {
  metric_name: string;
  metric_score: number; // between 1-100
}

export let goal_data: Metric[] = [];
	// Metrics data
	goal_data = [
		{ metric_name: 'calories', metric_score: 2000 },
		{ metric_name: 'protein', metric_score: 130 },
		{ metric_name: 'carbs', metric_score: 100 },
		{ metric_name: 'fats', metric_score: 50 },
		{ metric_name: 'sugar', metric_score: 20 },
		{ metric_name: 'fiber', metric_score: 30 },
		{ metric_name: 'satiety', metric_score: 100 }
	];

export type RadarChartConfig = {
  metrics: Metric[];
  maxRadius: number;
  cx: number;
  cy: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth?: number;
}

export function polarToCartesian(r: number, angleIndex: number, numPoints: number, cx: number, cy: number): {x: number, y: number} {
  // calculate the angle in radians for x=rcos(theta) and y=rsin(theta)
  const angleDeg = (angleIndex * 360) / numPoints - 90;
  const angleRad = (Math.PI / 180) * angleDeg;

  const x = cx + r * Math.cos(angleRad);
  const y = cy + r * Math.sin(angleRad);
  return { x, y };
}

export function calculateDataPoints(metrics: Metric[], maxRadius: number, cx: number, cy: number): {x: number, y: number}[] {
  const numMetrics = metrics.length;
  return metrics.map((metric, i) => {
    // Optionally normalize by metric_score if needed
    // const normalizedScore = (metric.metric_score / 100) * maxRadius;
    let score_ratio = metric.metric_score / goal_data[i].metric_score;
    if(score_ratio > 1) {
      score_ratio = 1/score_ratio;
    }
    return polarToCartesian(score_ratio * maxRadius, i, numMetrics, cx, cy);
  });
}

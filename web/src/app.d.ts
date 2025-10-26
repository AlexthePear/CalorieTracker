// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {
  type Metric = {
  metric_name: string;
  metric_score: number; // between 1-100
};
type MetricsData = {
  calories: Metric;
  protein: Metric;
  carbs: Metric;
  fats: Metric;
  sugar: Metric;
  fiber: Metric;
  satiety: Metric;
};

};

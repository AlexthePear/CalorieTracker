<script>
	import RadarChart from '../components/RadarChart.svelte';
	let URL = 'https://calorie-tracker-backend-puce.vercel.app';
	const getData = async () => {
		const response = await fetch(URL, {
			method: 'GET',
			credentials: 'include', // This sends cookies and authentication headers
			headers: {
				'Content-Type': 'application/json'
				// Add other headers if needed, e.g., 'Authorization' for token-based auth
			}
		});
		const rJson = await response.json();
		console.log(rJson);
		return rJson;
	};
</script>

<h1
	class="bg-gray-800 p-4 text-white gap-4 flex min-h-screen flex-col items-center justify-center select-none"
>
	<p>Daily Data</p>
	<RadarChart />
</h1>

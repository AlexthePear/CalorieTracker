<script>
	import RadarChart from '../components/RadarChart.svelte';
	const uid = 'id';
	let URL = 'https://calorie-tracker-backend-puce.vercel.app/';
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

<div
	class="bg-gray-800 p-4 text-white gap-4 flex min-h-screen flex-col items-center justify-center select-none"
>
	<p class="text-white p-2">Daily Data</p>
	<RadarChart />
	<button on:click={getData}> get_goals</button>
</div>

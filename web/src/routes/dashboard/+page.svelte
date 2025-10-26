<script lang="ts">
	const username = 'user123';
	const goals = [
		{ name: 'Calories', current: 1650, target: 2000, unit: 'kcal' },
		{ name: 'Protein', current: 85, target: 120, unit: 'g' },
		{ name: 'Carbs', current: 181, target: 250, unit: 'g' }
	];

	function getProgressPercentage(current: number, target: number) {
		return Math.min((current / target) * 100, 100);
	}
</script>

<div class="min-h-screen bg-base-200">
	<!-- Nav -->
	<div class="navbar bg-base-100 shadow">
		<div class="flex-1">
			<a href="/dashboard" class="btn btn-ghost text-xl">NutriTrack</a>
		</div>
		<div class="flex-none gap-2">
			<a href="/dashboard" class="btn btn-sm btn-ghost">Dashboard</a>
			<a href="/leaderboards" class="btn btn-sm btn-ghost">Leaderboards</a>
			<a href="/profile" class="btn btn-sm btn-ghost">Profile</a>
			<a href="/" class="btn btn-sm">Logout</a>
		</div>
	</div>

	<!-- Content -->
	<div class="container mx-auto p-6 max-w-4xl">
		<h1 class="text-3xl font-bold mb-6">Dashboard</h1>

		<!-- Goals -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Today's Goals</h2>
				<div class="space-y-4 mt-4">
					{#each goals as goal}
						{@const percentage = getProgressPercentage(goal.current, goal.target)}
						<div>
							<div class="flex justify-between mb-1">
								<span class="font-medium">{goal.name}</span>
								<span class="text-sm opacity-70">{goal.current} / {goal.target} {goal.unit}</span>
							</div>
							<progress class="progress progress-primary w-full" value={percentage} max="100"></progress>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

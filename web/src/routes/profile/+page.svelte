<script lang="ts">
	const username = 'user123';
	let isEditing = $state(false);

	let goals = $state([
		{ name: 'Calories', target: 2000, unit: 'kcal' },
		{ name: 'Protein', target: 120, unit: 'g' },
		{ name: 'Carbs', target: 250, unit: 'g' }
	]);

	const stats = {
		streak: 12,
		totalDays: 45,
		avgAdherence: 87
	};
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
	<div class="container mx-auto p-6 max-w-4xl space-y-6">
		<h1 class="text-3xl font-bold">Profile</h1>

		<!-- Stats -->
		<div class="grid grid-cols-3 gap-4">
			<div class="card bg-base-100 shadow">
				<div class="card-body text-center">
					<div class="text-3xl font-bold text-primary">{stats.streak}</div>
					<div class="text-sm opacity-70">Day Streak</div>
				</div>
			</div>
			<div class="card bg-base-100 shadow">
				<div class="card-body text-center">
					<div class="text-3xl font-bold text-secondary">{stats.totalDays}</div>
					<div class="text-sm opacity-70">Total Days</div>
				</div>
			</div>
			<div class="card bg-base-100 shadow">
				<div class="card-body text-center">
					<div class="text-3xl font-bold text-accent">{stats.avgAdherence}%</div>
					<div class="text-sm opacity-70">Avg Adherence</div>
				</div>
			</div>
		</div>

		<!-- Goals -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex justify-between items-center mb-4">
					<h2 class="card-title">Nutrition Goals</h2>
					<button class="btn btn-sm btn-primary" onclick={() => (isEditing = !isEditing)}>
						{isEditing ? 'Done' : 'Edit'}
					</button>
				</div>

				<div class="space-y-3">
					{#each goals as goal}
						<div class="flex items-center gap-4">
							<span class="font-medium flex-1">{goal.name}</span>
							{#if isEditing}
								<input type="number" bind:value={goal.target} class="input input-bordered input-sm w-24" />
								<span class="text-sm opacity-70 w-12">{goal.unit}</span>
							{:else}
								<span class="text-sm opacity-70">{goal.target} {goal.unit}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

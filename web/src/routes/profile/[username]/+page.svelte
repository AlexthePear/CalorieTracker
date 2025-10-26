<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	interface NutritionGoal {
		name: string;
		current: number;
		target: number;
		unit: string;
	}

	const currentUsername = 'user123'; // In real app, get from auth store
	const profileUsername = $page.params.username;

	// Mock data - in a real app this would come from the backend based on profileUsername
	const goals: NutritionGoal[] = [
		{ name: 'Calories', current: 1800, target: 2200, unit: 'kcal' },
		{ name: 'Protein', current: 95, target: 140, unit: 'g' },
		{ name: 'Carbs', current: 200, target: 270, unit: 'g' },
		{ name: 'Fats', current: 55, target: 75, unit: 'g' },
		{ name: 'Fiber', current: 22, target: 35, unit: 'g' },
		{ name: 'Sugar', current: 40, target: 55, unit: 'g' },
		{ name: 'Satiety Index', current: 78, target: 90, unit: '%' }
	];

	const stats = {
		streak: 8,
		totalDays: 32,
		avgAdherence: 82,
		totalMeals: 96,
		favoriteFood: 'Protein Pancakes'
	};

	const recentMeals = [
		{ date: 'Today', meal: 'Protein Pancakes', calories: 380 },
		{ date: 'Today', meal: 'Turkey Sandwich', calories: 420 },
		{ date: 'Yesterday', meal: 'Chicken Stir Fry', calories: 510 },
		{ date: 'Yesterday', meal: 'Fruit Smoothie', calories: 260 },
		{ date: '2 days ago', meal: 'Tuna Salad', calories: 340 },
		{ date: '2 days ago', meal: 'Oatmeal with Nuts', calories: 310 }
	];

	function getProgressPercentage(current: number, target: number) {
		return Math.min((current / target) * 100, 100);
	}

	function getProgressColor(percentage: number) {
		if (percentage >= 80) return 'progress-success';
		if (percentage >= 50) return 'progress-warning';
		return 'progress-error';
	}

	function handleLogout() {
		goto('/');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
	<!-- Navigation -->
	<div class="navbar bg-base-100 shadow-md">
		<div class="container mx-auto">
			<div class="flex-1">
				<a href="/dashboard" class="btn btn-ghost text-xl text-primary">NutriTrack</a>
			</div>
			<div class="flex-none gap-2">
				<span class="text-sm">Welcome, {currentUsername}</span>
				<a href="/dashboard" class="btn btn-sm btn-ghost">Dashboard</a>
				<a href="/leaderboards" class="btn btn-sm btn-ghost">Leaderboards</a>
				<a href="/profile" class="btn btn-sm btn-ghost">Profile</a>
				<button class="btn btn-sm btn-ghost" onclick={handleLogout}>Logout</button>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto p-6 space-y-6">
		<!-- Back Button -->
		<a href="/leaderboards" class="btn btn-outline">← Back to Leaderboards</a>

		<!-- User Header -->
		<div class="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-3xl">{profileUsername}'s Profile</h2>
				<p class="text-base">Public stats and achievements</p>
			</div>
		</div>

		<!-- User Stats Card -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">Stats & Achievements</h2>

				<div class="grid md:grid-cols-5 gap-6 mt-4">
					<div class="stats shadow bg-success text-success-content">
						<div class="stat place-items-center">
							<div class="stat-value">{stats.streak}</div>
							<div class="stat-desc text-success-content">Day Streak</div>
						</div>
					</div>
					<div class="stats shadow bg-info text-info-content">
						<div class="stat place-items-center">
							<div class="stat-value">{stats.totalDays}</div>
							<div class="stat-desc text-info-content">Total Days</div>
						</div>
					</div>
					<div class="stats shadow bg-secondary text-secondary-content">
						<div class="stat place-items-center">
							<div class="stat-value">{stats.avgAdherence}%</div>
							<div class="stat-desc text-secondary-content">Avg Adherence</div>
						</div>
					</div>
					<div class="stats shadow bg-warning text-warning-content">
						<div class="stat place-items-center">
							<div class="stat-value">{stats.totalMeals}</div>
							<div class="stat-desc text-warning-content">Meals Logged</div>
						</div>
					</div>
					<div class="stats shadow bg-accent text-accent-content">
						<div class="stat place-items-center">
							<div class="stat-value text-lg">{stats.favoriteFood}</div>
							<div class="stat-desc text-accent-content">Favorite Food</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Nutritional Goals Card -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-2xl">Current Goals</h2>
				<p class="text-sm opacity-70">Daily nutritional targets</p>

				<div class="space-y-6 mt-4">
					{#each goals as goal}
						{@const percentage = getProgressPercentage(goal.current, goal.target)}
						<div class="space-y-2">
							<div class="flex justify-between items-center">
								<span class="font-medium">{goal.name}</span>
								<span class="text-sm opacity-70">
									{goal.current} / {goal.target}
									{goal.unit}
								</span>
							</div>
							<progress
								class="progress {getProgressColor(percentage)} w-full"
								value={percentage}
								max="100"
							></progress>
							<div class="text-xs opacity-60">{percentage.toFixed(0)}% of daily goal</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Recent Meals Card -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Recent Meals</h2>
				<p class="text-sm opacity-70">Foods logged this week</p>

				<div class="space-y-3 mt-4">
					{#each recentMeals as item}
						<div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
							<div>
								<div class="font-medium">{item.meal}</div>
								<div class="text-sm opacity-70">{item.date}</div>
							</div>
							<div class="badge badge-success">{item.calories} kcal</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

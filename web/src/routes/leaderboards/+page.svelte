<script lang="ts">
	const username = 'user123';

	const leaderboard = [
		{ rank: 1, username: 'john_doe', score: 95 },
		{ rank: 2, username: 'jane_smith', score: 92 },
		{ rank: 3, username: username, score: 87 },
		{ rank: 4, username: 'mike_wilson', score: 84 },
		{ rank: 5, username: 'sarah_jones', score: 81 }
	];
</script>

<div class="min-h-screen bg-base-200">
	<!-- Nav -->
	<div class="navbar bg-base-100 shadow">
		<div class="flex-1">
			<a href="/dashboard" class="btn btn-ghost text-xl">My APP</a>
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
		<h1 class="text-3xl font-bold mb-6">Leaderboard</h1>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="space-y-3">
					{#each leaderboard as entry}
						<div class="flex items-center gap-4 p-4 {entry.username === username ? 'bg-primary/10 border-2 border-primary' : 'bg-base-200'} rounded-lg">
							<div class="badge badge-lg">{entry.rank}</div>
							<div class="flex-1">
								<p class="font-medium">{entry.username}</p>
								{#if entry.username === username}
									<span class="badge badge-primary badge-sm">You</span>
								{/if}
							</div>
							<div class="text-xl font-bold">{entry.score}</div>
						</div>
					{/each}

				</div>
			</div>
		</div>
	</div>
</div>

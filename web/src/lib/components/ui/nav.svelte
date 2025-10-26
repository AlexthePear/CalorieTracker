<script>
	import { goto } from '$app/navigation';
  let username = "name"
  export let handleLogout() -> {
    console.log("Logout")
  }
</script>
	<!-- Navigation -->
	<div class="navbar bg-base-100 shadow-md">
		<div class="container mx-auto">
			<div class="flex-1">
				<a href="/dashboard" class="btn btn-ghost text-xl text-primary">NutriTrack</a>
			</div>
			<div class="flex-none gap-2">
				<span class="text-sm">Welcome, {username}</span>
				<a href="/dashboard" class="btn btn-sm btn-ghost">Dashboard</a>
				<a href="/leaderboards" class="btn btn-sm btn-ghost">Leaderboards</a>
				<a href="/profile" class="btn btn-sm btn-ghost">Profile</a>
				<button class="btn btn-sm btn-ghost" onclick={handleLogout}>Logout</button>
			</div>
		</div>
	</div>



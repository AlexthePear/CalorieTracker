<script lang="ts">
	import { goto } from '$app/navigation';

	async function handleLogin() {
		goto('/dashboard');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200">
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl justify-center">NutriTrack</h2>
			<p class="text-center text-sm opacity-70">Track your nutrition goals</p>

			<form class="space-y-4 mt-4" onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
				<div class="form-control">
					<label for="email" class="label">
						<span class="label-text">Email</span>
					</label>
					<input
						id="email"
						type="email"
						placeholder="email@example.com"
						class="input input-bordered"
						required
					/>
				</div>

				<div class="form-control">
					<label for="password" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						id="password"
						type="password"
						placeholder="Password"
						class="input input-bordered"
						required
					/>
				</div>

				<button type="submit" class="btn btn-primary w-full">Login</button>
			</form>
		</div>
	</div>
</div>

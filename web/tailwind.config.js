/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'slide-left': 'slideLeft 0.5s ease-out',
				'slide-right': 'slideRight 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'bounce-in': 'bounceIn 0.6s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideLeft: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				slideRight: {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				bounceIn: {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			boxShadow: {
				'glow': '0 0 20px rgba(var(--color-primary), 0.3)',
				'glow-lg': '0 0 30px rgba(var(--color-primary), 0.4)',
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			'light',
			'dark',
			'cupcake',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'aqua',
			'forest',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'dracula',
			'autumn',
			'business',
			'night'
		],
		darkTheme: 'dark',
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: false,
		themeRoot: ':root'
	}
};

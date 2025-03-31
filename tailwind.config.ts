
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for air quality
				'air-blue': {
					light: '#4facfe',
					DEFAULT: '#2b8af9',
					dark: '#0c65d8'
				},
				'air-green': {
					light: '#96fbc4',
					DEFAULT: '#26d0ce',
					dark: '#1a867f'
				},
				'air-red': {
					light: '#ff9a9e',
					DEFAULT: '#ff5858',
					dark: '#d13131'
				},
				'air-yellow': {
					light: '#ffeaa7',
					DEFAULT: '#ffdd59',
					dark: '#ffc107'
				},
				'air-purple': {
					light: '#e2b0ff',
					DEFAULT: '#9f7aea',
					dark: '#6b46c1'
				},
				'air-orange': {
					light: '#ffd3a5',
					DEFAULT: '#fd7e14',
					dark: '#b54708'
				},
				'air-teal': {
					light: '#81e6d9',
					DEFAULT: '#38b2ac',
					dark: '#2c7a7b'
				},
				'air-pink': {
					light: '#fbb6ce',
					DEFAULT: '#ed64a6',
					dark: '#b83280'
				},
				'dashboard-bg': '#0b1120',
				'card-bg': 'rgba(20, 30, 48, 0.7)',
				'card-border': 'rgba(66, 99, 235, 0.2)',
				'chart-grid': 'rgba(66, 99, 235, 0.1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'shimmer': 'shimmer 2s infinite linear',
				'gradient-shift': 'gradient-shift 15s ease infinite',
				'fade-in': 'fade-in 0.5s ease-out'
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'glow': '0 0 15px rgba(66, 153, 225, 0.5)',
				'inner-glow': 'inset 0 0 15px rgba(66, 153, 225, 0.3)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

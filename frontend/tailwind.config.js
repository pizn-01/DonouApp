/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Keep CSS variable support for shadcn components
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                // Design system color palette
                primary: {
                    DEFAULT: '#2563EB',
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#374151',
                },
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                success: {
                    DEFAULT: '#16A34A',
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    600: '#16A34A',
                    700: '#15803D',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    500: '#F59E0B',
                    600: '#D97706',
                },
                error: {
                    DEFAULT: '#DC2626',
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    600: '#DC2626',
                    700: '#B91C1C',
                },
                purple: {
                    50: '#FAF5FF',
                    100: '#F3E8FF',
                    200: '#E9D5FF',
                    500: '#A855F7',
                    600: '#9333EA',
                    700: '#7E22CE',
                },
                destructive: {
                    DEFAULT: '#DC2626',
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: '#F3F4F6',
                    foreground: '#6B7280',
                },
                accent: {
                    DEFAULT: '#F3F4F6',
                    foreground: '#111827',
                },
                popover: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#111827',
                },
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#111827',
                },
            },
            borderRadius: {
                lg: '8px',
                md: '6px',
                sm: '4px',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                'h1': ['36px', { lineHeight: '40px', fontWeight: '700' }],
                'h2': ['30px', { lineHeight: '36px', fontWeight: '700' }],
                'h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
                'h4': ['20px', { lineHeight: '28px', fontWeight: '600' }],
                'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
                'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
                'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
                'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}

// src/utils/theme.js
export const getThemeValue = (lightValue, darkValue) => {
    return document.documentElement.classList.contains('dark') ? darkValue : lightValue;
};

export const chartColors = {
    primary: getThemeValue('rgb(14, 165, 233)', 'rgb(56, 189, 248)'),
    secondary: getThemeValue('rgb(139, 92, 246)', 'rgb(167, 139, 250)'),
    success: getThemeValue('rgb(34, 197, 94)', 'rgb(74, 222, 128)'),
    danger: getThemeValue('rgb(239, 68, 68)', 'rgb(248, 113, 113)'),
    warning: getThemeValue('rgb(245, 158, 11)', 'rgb(251, 191, 36)'),
    info: getThemeValue('rgb(6, 182, 212)', 'rgb(45, 212, 191)'),
    background: getThemeValue('rgb(255, 255, 255)', 'rgb(30, 41, 59)'),
    text: getThemeValue('rgb(15, 23, 42)', 'rgb(241, 245, 249)'),
    border: getThemeValue('rgb(226, 232, 240)', 'rgb(51, 65, 85)'),
};

export const chartDefaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: getThemeValue('rgb(15, 23, 42)', 'rgb(241, 245, 249)'),
                font: {
                    family: 'Inter, sans-serif',
                },
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: getThemeValue('rgb(255, 255, 255)', 'rgb(30, 41, 59)'),
            titleColor: getThemeValue('rgb(15, 23, 42)', 'rgb(241, 245, 249)'),
            bodyColor: getThemeValue('rgb(15, 23, 42)', 'rgb(241, 245, 249)'),
            borderColor: getThemeValue('rgb(226, 232, 240)', 'rgb(51, 65, 85)'),
            borderWidth: 1,
            padding: 12,
            titleFont: {
                family: 'Inter, sans-serif',
                size: 14,
                weight: 'bold',
            },
            bodyFont: {
                family: 'Inter, sans-serif',
                size: 13,
            },
            displayColors: false,
        },
    },
    scales: {
        x: {
            grid: {
                color: getThemeValue('rgba(226, 232, 240, 0.5)', 'rgba(51, 65, 85, 0.5)'),
            },
            ticks: {
                color: getThemeValue('rgb(15, 23, 42)', 'rgb(241, 245, 249)'),
                font: {
                    family: 'Inter, sans-serif',
                },
            },
        },
        y: {
            grid: {
                color: getThemeValue('rgba(226, 232, 240, 0.5)', 'rgba(51, 65, 85, 0.5)'),
            },
            ticks: {
                color: getThemeValue('rgb(15, 23, 42)', 'rgb(241, 245, 249)'),
                font: {
                    family: 'Inter, sans-serif',
                },
            },
        },
    },
};
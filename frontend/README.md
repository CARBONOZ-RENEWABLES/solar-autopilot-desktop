# CARBONOZ SolarAutopilot - React Frontend

A modern React.js frontend for the CARBONOZ SolarAutopilot AI Charging Engine, built with Tailwind CSS for enhanced design and user experience.

## Features

- 🎨 **Modern Design**: Clean, responsive UI built with Tailwind CSS
- 🌙 **Dark Mode**: Full dark mode support with system preference detection
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- ⚡ **Real-time Updates**: Live data from your solar system
- 🤖 **AI Dashboard**: Monitor AI charging decisions and predictions
- 📊 **Analytics**: Comprehensive energy analytics with charts
- ⚙️ **Settings**: Easy configuration of Tibber and system settings
- 🔔 **Notifications**: System alerts and status updates

## Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Chart.js** - Interactive charts and graphs
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- CARBONOZ SolarAutopilot backend running on port 6789

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   └── LoadingOverlay.jsx
│   ├── pages/              # Page components
│   │   ├── EnergyDashboard.jsx
│   │   ├── AIDashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   └── useTheme.js     # Theme management
│   ├── services/           # API services
│   │   └── api.js          # HTTP client setup
│   ├── utils/              # Utility functions
│   │   └── index.js        # Common utilities
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

## Key Components

### Energy Dashboard
- Real-time system metrics
- CO₂ emissions tracking
- Self-sufficiency scoring
- Grafana dashboard integration

### AI Dashboard
- AI engine status and controls
- Real-time decisions and commands
- Tibber price integration
- Solar production predictions

### Analytics
- Historical energy data
- Interactive charts
- Performance metrics
- Export capabilities

### Settings
- Tibber API configuration
- System preferences
- AI engine settings
- Zone and timezone setup

## API Integration

The frontend communicates with the backend through a proxy configuration in Vite. All API calls are automatically forwarded to `http://localhost:6789`.

### Key Endpoints

- `/api/system-state` - Real-time system data
- `/api/ai/*` - AI engine endpoints
- `/api/tibber/*` - Tibber integration
- `/api/settings` - Configuration management

## Customization

### Theming

The app uses Tailwind CSS with a custom color palette. You can modify colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#DEAF0B',
    // ... other shades
  }
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `App.jsx`
3. Add navigation item in `Sidebar.jsx`

### Custom Hooks

Create reusable logic with custom hooks in `src/hooks/`. Example:

```javascript
// src/hooks/useSystemData.js
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export function useSystemData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getSystemState()
        setData(response.data)
      } catch (error) {
        console.error('Error fetching system data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading }
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality. Run `npm run lint` to check for issues.

### Hot Reload

Vite provides instant hot reload during development. Changes to components will be reflected immediately in the browser.

## Deployment

### Static Hosting

After building (`npm run build`), deploy the `dist` folder to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Docker

You can also serve the built files with a simple web server:

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **API calls failing**: Ensure the backend is running on port 6789
2. **Build errors**: Clear node_modules and reinstall dependencies
3. **Styling issues**: Check Tailwind CSS configuration

### Performance

- Use React DevTools to identify performance bottlenecks
- Implement code splitting for large components
- Optimize images and assets

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types where applicable
3. Test components thoroughly
4. Update documentation for new features

## License

This project is part of the CARBONOZ SolarAutopilot system and follows the same license terms.
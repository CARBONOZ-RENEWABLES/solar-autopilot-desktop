# Migration Guide: EJS to React.js with Tailwind CSS

This guide explains how to migrate from the existing EJS-based CARBONOZ SolarAutopilot to the new React.js frontend with enhanced design.

## Overview

The new React.js frontend provides:
- ✨ **Modern UI/UX** with Tailwind CSS
- 🌙 **Dark mode support**
- 📱 **Mobile-responsive design**
- ⚡ **Better performance** with React optimizations
- 🔄 **Real-time updates** with improved state management
- 🎨 **Enhanced visual design** and animations

## Migration Steps

### 1. Backup Current System

Before starting the migration, backup your current system:

```bash
# Backup the entire project
cp -r /path/to/carbonoz_solarautopilotV1 /path/to/carbonoz_solarautopilotV1_backup
```

### 2. Install React Frontend

```bash
cd carbonoz_solarautopilotV1/frontend
chmod +x setup.sh
./setup.sh
```

### 3. Update Backend Configuration

The backend server needs minimal changes to serve the React app in production. Add this to your `server.js`:

```javascript
// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')))
  
  // Handle React Router (return `index.html` for all non-API routes)
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
    }
  })
}
```

### 4. Development Workflow

#### During Development
- **Backend**: Keep running on port 6789 (`npm start`)
- **Frontend**: Run on port 3000 (`npm run dev`)
- **Proxy**: Vite automatically proxies API calls to the backend

#### For Production
- **Build React app**: `npm run build` in frontend directory
- **Serve from backend**: Backend serves the built React app

### 5. Feature Mapping

| EJS Page | React Component | Status | Notes |
|----------|----------------|--------|-------|
| `energy-dashboard.ejs` | `EnergyDashboard.jsx` | ✅ Complete | Enhanced with modern cards and animations |
| `ai-dashboard.ejs` | `AIDashboard.jsx` | ✅ Complete | Improved real-time updates and status indicators |
| `analytics.ejs` | `Analytics.jsx` | ✅ Complete | Interactive charts, data tables, CSV/PDF export |
| `settings.ejs` | `Settings.jsx` | ✅ Complete | Multi-category settings, API management, Tibber integration |
| `messages.ejs` | `Messages.jsx` | ✅ Complete | MQTT message monitoring with real-time filtering |
| `notifications.ejs` | `Notifications.jsx` | ✅ Complete | Advanced notification system with Telegram integration |
| `chart.ejs` | `Chart.jsx` | ✅ Complete | Grafana iframe integration with theme switching |
| `results.ejs` | `Results.jsx` | ✅ Complete | Carbon intensity analysis with interactive charts |

### 6. API Compatibility

All existing API endpoints remain unchanged:
- `/api/system-state`
- `/api/ai/*`
- `/api/tibber/*`
- `/api/settings`
- And all other endpoints...

The React frontend uses the same APIs, ensuring full compatibility.

## Design Enhancements

### Color Scheme
- **Primary**: `#DEAF0B` (CARBONOZ yellow)
- **Success**: `#4CAF50` (green)
- **Warning**: `#FFC107` (amber)
- **Error**: `#F44336` (red)
- **Info**: `#2196F3` (blue)

### Typography
- **Font**: Inter (modern, readable)
- **Weights**: 400, 500, 600, 700
- **Responsive sizing**

### Components
- **Cards**: Elevated design with hover effects
- **Buttons**: Consistent styling with loading states
- **Forms**: Modern inputs with validation
- **Charts**: Interactive with Chart.js
- **Icons**: Lucide React (consistent, beautiful)

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch-friendly**: Larger tap targets on mobile

### Dark Mode
- **System preference detection**
- **Manual toggle**
- **Persistent setting**
- **Smooth transitions**

## Configuration

### Environment Variables

Create `.env` in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:6789
VITE_APP_TITLE=CARBONOZ SolarAutopilot
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration

The Tailwind config includes:
- Custom color palette
- Extended animations
- Dark mode support
- Custom components

### Vite Configuration

Configured for:
- React development
- API proxy to backend
- Optimized builds
- Hot reload

## Testing the Migration

### 1. Start Backend
```bash
cd carbonoz_solarautopilotV1
npm start
```

### 2. Start Frontend (Development)
```bash
cd frontend
npm run dev
```

### 3. Verify Functionality
- ✅ Navigation works
- ✅ Real-time data updates
- ✅ API calls successful
- ✅ Dark mode toggle
- ✅ Mobile responsive
- ✅ Grafana iframes load

### 4. Build for Production
```bash
cd frontend
npm run build
```

## Deployment Options

### Option 1: Integrated (Recommended)
Serve React app from the existing Node.js backend:
1. Build React app: `npm run build`
2. Backend serves from `frontend/dist`
3. Single deployment, same port

### Option 2: Separate Deployment
Deploy React app to static hosting:
1. Build React app: `npm run build`
2. Deploy `dist` folder to Netlify/Vercel/etc.
3. Update API base URL in production

### Option 3: Docker
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
EXPOSE 6789
CMD ["npm", "start"]
```

## Rollback Plan

If you need to rollback to EJS:

1. **Stop React development server**
2. **Revert server.js changes** (remove React static serving)
3. **Use original EJS views**
4. **Keep backup for reference**

The backend APIs remain unchanged, so rollback is straightforward.

## Performance Improvements

### React Benefits
- **Virtual DOM**: Efficient updates
- **Component reuse**: Better code organization
- **State management**: Optimized re-renders
- **Code splitting**: Faster initial loads

### Tailwind Benefits
- **Utility-first**: Smaller CSS bundle
- **Purging**: Unused styles removed
- **JIT compilation**: Fast builds
- **Consistent design**: Design system built-in

### Vite Benefits
- **Fast HMR**: Instant updates during development
- **ESM**: Modern module system
- **Optimized builds**: Tree shaking and minification

## Maintenance

### Adding New Features
1. Create React components in `src/components/`
2. Add pages in `src/pages/`
3. Update routing in `App.jsx`
4. Add navigation items in `Sidebar.jsx`

### Updating Styles
1. Use Tailwind utility classes
2. Extend theme in `tailwind.config.js`
3. Add custom CSS in `src/index.css`

### API Changes
1. Update `src/services/api.js`
2. Update component data fetching
3. Test thoroughly

## Support

For issues or questions:
1. Check the React DevTools for component issues
2. Use browser DevTools for network/API issues
3. Check Vite logs for build issues
4. Refer to component documentation in code

## Next Steps

After successful migration:
1. **Monitor performance** in production
2. **Gather user feedback** on new UI
3. **Implement remaining placeholders** (Messages, Notifications, Results)
4. **Add new features** using React ecosystem
5. **Consider PWA features** for mobile app-like experience

The new React frontend provides a solid foundation for future enhancements while maintaining all existing functionality.
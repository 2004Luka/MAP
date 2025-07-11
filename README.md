# GeoRoutes - Interactive Pathfinding Visualization

A sophisticated web application for visualizing optimal paths between Georgian cities using various pathfinding algorithms. Built with React, TypeScript, and modern web technologies.

![GeoRoutes Demo](https://img.shields.io/badge/Status-Live%20Demo-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)

## 🚀 Live Demo

[View Live Demo](https://your-demo-link.com)

## ✨ Features

### 🧠 Advanced Pathfinding Algorithms
- **A* Algorithm**: Optimal pathfinding with real road routing
- **IDDFS (Iterative Deepening Depth-First Search)**: Complete search with straight-line distance
- **Real-time Algorithm Comparison**: Visualize differences between algorithms
- **Performance Metrics**: Track nodes explored and execution time

### 🗺️ Interactive Map Features
- **Custom Markers**: Distinct icons for start, end, and waypoint cities
- **Route Animations**: Smooth animated path drawing with progress indicators
- **Multiple Map Styles**: Light, dark, and satellite themes
- **3D Map View**: Three.js-powered 3D visualization with elevation
- **Responsive Design**: Optimized for desktop and mobile devices

### 🔗 Route Sharing & Collaboration
- **Shareable Links**: Generate URLs that preserve route state
- **Native Sharing**: Use device's native share functionality
- **Clipboard Integration**: One-click link copying
- **Route Details**: Complete route information in shared links

### 🎨 Enhanced User Experience
- **Dark Mode Support**: Seamless theme switching
- **Progress Indicators**: Real-time animation progress
- **Customizable Styling**: Adjust markers, routes, and map appearance
- **Mobile-First Design**: Touch-friendly interface

## 🛠️ Technical Stack

### Frontend
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5.8.3**: Type-safe development
- **Vite 6.3.5**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

### Mapping & Visualization
- **Leaflet**: Interactive maps
- **React-Leaflet**: React bindings for Leaflet
- **Three.js**: 3D graphics and visualization
- **OSRM API**: Real road routing data

### State Management & Utilities
- **React Hooks**: Modern state management
- **js-cookie**: Persistent user preferences
- **Custom Algorithms**: Self-implemented pathfinding

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/georoutes.git
cd georoutes

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

No environment variables required - the application uses public APIs.

## 📁 Project Structure

```
src/
├── algorithms/          # Pathfinding algorithm implementations
│   └── pathfinding.ts  # A* and IDDFS algorithms
├── components/          # React components
│   ├── AlgorithmSelect.tsx
│   ├── CitySearch.tsx
│   ├── PathfindingControls.tsx
│   ├── PathResults.tsx
│   ├── RouteSharing.tsx
│   ├── Settings.tsx
│   └── ThreeDMap.tsx   # 3D visualization
├── data/               # Static data
│   └── cities.ts       # Georgian cities dataset
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── map.ts          # Map utilities
│   ├── pathfinding.ts  # Graph creation utilities
│   ├── routeAnimation.ts # Animation utilities
│   └── routeSharing.ts # Sharing functionality
├── App.tsx             # Main application component
└── Map.tsx             # Map component
```

## 🎯 Key Features Deep Dive

### 1. Custom Markers System
```typescript
// Distinct visual styles for different marker types
export const createStartIcon = () => {
  return L.divIcon({
    className: 'start-marker-icon',
    html: `<div style="background: linear-gradient(135deg, #EF4444, #DC2626);...">`
  });
};
```

### 2. Route Animation Engine
```typescript
// Smooth path drawing with progress tracking
export const createRouteAnimation = (
  path: [number, number][],
  duration: number = 3000,
  onProgress?: (progress: number) => void
) => {
  // Animation implementation
};
```

### 3. 3D Visualization
```typescript
// Three.js-powered 3D map with city markers
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
// 3D scene setup with cities and routes
```

### 4. Route Sharing
```typescript
// Generate shareable URLs with complete route state
export const generateShareableLink = (route: SharedRoute): string => {
  const params = new URLSearchParams({
    start: route.startCity,
    end: route.endCity,
    algorithm: route.algorithm,
    // ... complete route data
  });
  return `${baseUrl}?${params.toString()}`;
};
```

## 🎨 UI/UX Highlights

### Responsive Design
- **Desktop**: Full-featured sidebar interface
- **Mobile**: Collapsible sidebar with bottom results panel
- **Tablet**: Adaptive layout with touch-friendly controls

### Animation System
- **Route Drawing**: Smooth path animation with progress indicators
- **Marker Interactions**: Hover effects and scaling animations
- **Theme Transitions**: Smooth dark/light mode switching

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Dark mode support for better visibility

## 🔧 Customization

### Map Styling
```typescript
// Customize marker appearance
const markerStyle = {
  size: 4,
  color: '#6B7280'
};

// Customize route appearance
const routeStyle = {
  weight: 3,
  color: '#3B82F6',
  opacity: 0.8
};
```

### Algorithm Parameters
```typescript
// Adjust algorithm behavior
const heuristic = createHeuristic(cities, endCity.name);
const result = astar(graph, heuristic, startCity.name, endCity.name);
```

## 📊 Performance Optimizations

### Algorithm Efficiency
- **A* Algorithm**: O(b^d) complexity with heuristic optimization
- **IDDFS**: Memory-efficient depth-first search
- **Graph Caching**: Pre-computed city connections

### Rendering Performance
- **Virtual Scrolling**: Efficient large dataset rendering
- **Debounced Updates**: Smooth real-time interactions
- **Web Workers**: Heavy computations off main thread

### Bundle Optimization
- **Code Splitting**: Lazy-loaded components
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed images and fonts

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OSRM Project**: Real road routing data
- **Leaflet**: Interactive mapping library
- **Three.js**: 3D graphics library
- **Georgian Cities Data**: Comprehensive city dataset

## 📞 Contact

- **Portfolio**: [Your Portfolio](https://your-portfolio.com)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **GitHub**: [Your GitHub](https://github.com/yourusername)

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

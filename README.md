# HomeClear React App

A modern React version of the HomeClear property purchase tracker.

## 🚀 Quick Start (No Setup Required!)

### Option 1: Run with Create React App (Recommended)
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Option 2: Use Vite (Faster)
```bash
# Install Vite
npm install -g vite

# Start development server
vite
```

### iOS Companion App
The repo now includes a starter SwiftUI shell under `ios/HomeClear/`.

```bash
# Open the iOS project
cd ios/HomeClear
xed .
```

From Xcode you can run the SwiftUI app in the simulator. The default screen is a placeholder—wire it up to Firebase or your API when ready.

## 📱 Features

- **Dashboard** - Property purchase overview with progress tracking
- **Live Timeline** - Real-time updates from all parties
- **Team Management** - Contact management for solicitors, agents, etc.
- **Property Search** - Find properties and get valuations
- **Data Persistence** - All data saved to localStorage
- **Export/Import** - Backup and restore your data
- **Responsive Design** - Works on desktop and mobile

## 🎯 What's Different from HTML Version

### React Benefits:
- ✅ **Component-based** - Easier to maintain and extend
- ✅ **State management** - Automatic UI updates when data changes
- ✅ **Reusable components** - Build once, use everywhere
- ✅ **Better performance** - Only re-renders what changes
- ✅ **Modern development** - Hot reload, debugging tools
- ✅ **Easy deployment** - One command builds for production

### Same Features:
- ✅ **All original functionality** preserved
- ✅ **Same design** and user experience
- ✅ **Same data model** and localStorage
- ✅ **Export/Import** works identically

## 🛠 Development

### File Structure:
```
src/
├── App.js          # Main app component
├── App.css         # All styles
├── index.js        # React entry point
└── components/     # (Future: separate components)

public/
├── index.html      # HTML template
└── manifest.json   # PWA manifest
```

### Key Components:
- **App.js** - Main application with all views
- **DashboardView** - Property purchase overview
- **TimelineView** - Communication timeline
- **TeamView** - Contact management
- **PropertySearchView** - Property search and valuation

## 📦 Deployment

### Build for Production:
```bash
npm run build
```

### Deploy to Netlify/Vercel:
1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## 🔧 Customization

### Adding New Views:
1. Create new component in `App.js`
2. Add to navigation array
3. Add view case in main render

### Styling:
- All styles in `App.css`
- Uses CSS Grid and Flexbox
- Responsive design included
- Purple theme (`#8b5cf6`)

### Data Management:
- Uses `useLocalStorage` hook
- Auto-saves to localStorage
- Export/Import functionality
- No backend required

## 🎨 Design System

### Colors:
- **Primary:** `#8b5cf6` (Purple)
- **Success:** `#22c55e` (Green)
- **Warning:** `#f59e0b` (Orange)
- **Error:** `#dc2626` (Red)
- **Background:** `#fafafa` (Light Gray)

### Typography:
- **Font:** System fonts (San Francisco, Segoe UI, etc.)
- **Sizes:** 12px, 14px, 16px, 18px, 32px
- **Weights:** 400, 500, 600

### Spacing:
- **Padding:** 8px, 12px, 16px, 20px, 24px, 32px, 48px
- **Margins:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px

## 🚀 Next Steps

1. **Run the app** - `npm start`
2. **Test all features** - Dashboard, Timeline, Team, Search
3. **Customize** - Add your own components
4. **Deploy** - Build and deploy to production

## 📱 Mobile Support

The app is fully responsive and works great on:
- ✅ **iPhone** - Safari, Chrome
- ✅ **Android** - Chrome, Firefox
- ✅ **iPad** - Safari, Chrome
- ✅ **Desktop** - All modern browsers

## 🔄 Migration from HTML

If you have data in the HTML version:
1. **Export data** from HTML version
2. **Import data** in React version
3. **All data preserved** - timeline, team, tasks, etc.

---

**Ready to go!** Just run `npm install && npm start` and you'll have a modern React version of HomeClear! 🎉

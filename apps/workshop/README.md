# Vibe Coding Workshop Presentation

## 🎯 Overview

Interactive web-based presentation for the "Vibe Coding with Cursor AI" workshop. This presentation showcases modern web development techniques while delivering content about AI-assisted development workflows.

## ✨ Features

### 🎨 **Modern Design**

- **Gradient Backgrounds**: Beautiful gradient overlays with dark theme
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Typography**: Custom font stack with Inter and Poppins

### 🎮 **Interactive Controls**

- **Keyboard Navigation**: Arrow keys, Space, P for play/pause
- **Auto-play Mode**: Automatic slide progression with 8-second intervals
- **Progress Tracking**: Visual progress bar and slide counter
- **Shortcuts Help**: Press 'H' to view all keyboard shortcuts

### 📱 **Slide Types**

- **Title Slides**: Hero-style introduction slides
- **Content Slides**: Structured content with bullet points
- **Demo Slides**: Technology showcases with tech badges
- **Code Slides**: Syntax-highlighted code examples
- **Summary Slides**: Conclusion and Q&A slides

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to workshop directory
cd apps/workshop

# Install dependencies
npm install

# Start development server
npm run dev
```

The presentation will be available at `http://localhost:3001`

### Build for Production

```bash
# Build the presentation
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

### Keyboard Shortcuts

- **→** or **Space**: Next slide
- **←**: Previous slide
- **P**: Play/Pause auto-advance
- **H**: Show/hide keyboard shortcuts
- **Esc**: Close modals

### Mouse Controls

- **Navigation Buttons**: Bottom-right corner
- **Play/Pause Button**: Toggle auto-advance
- **Progress Bar**: Click to jump to specific slide
- **Shortcuts Button**: Top-right corner (keyboard icon)

## 📊 Slide Structure

The presentation contains **25 slides** covering:

1. **Introduction** - What is Vibe Coding?
2. **Agenda** - Workshop outline
3. **Core Concepts** - Rules, workflows, best practices
4. **Cursor AI** - Overview and model selection
5. **Demo** - Live Expense Manager development
6. **Testing Strategy** - Unit, Integration, E2E testing
7. **Summary** - Key takeaways and Q&A

## 🎨 Customization

### Adding New Slides

1. **Edit `src/slides/slidesData.ts`**:

```typescript
{
  id: 'new-slide',
  type: 'content', // title | content | demo | code | summary
  title: 'Slide Title',
  content: ['Bullet point 1', 'Bullet point 2'],
  tech: ['React', 'TypeScript'], // for demo slides
  code: 'console.log("Hello World");', // for code slides
  highlight: 'Important note' // optional highlight box
}
```

2. **Slide Types**:
   - `title`: Hero slides with large titles
   - `content`: Standard content with bullet points
   - `demo`: Technology showcases with badges
   - `code`: Code examples with syntax highlighting
   - `summary`: Conclusion slides

### Styling

- **Colors**: Edit `tailwind.config.js` for color schemes
- **Fonts**: Update font imports in `index.html`
- **Animations**: Modify animation durations in `App.tsx`
- **Layout**: Adjust spacing and sizing in `index.css`

## 📱 Responsive Design

The presentation is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance

- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading**: Lazy loading for animations
- **Memory**: Efficient state management
- **Smooth**: 60fps animations with Framer Motion

## 🔧 Development

### Project Structure

```
src/
├── components/          # Reusable components
│   ├── SlideRenderer.tsx
│   ├── ProgressIndicator.tsx
│   └── KeyboardShortcuts.tsx
├── slides/             # Slide data and content
│   └── slidesData.ts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

### Adding Features

1. **New Slide Types**: Extend `SlideRenderer.tsx`
2. **Custom Animations**: Add to `tailwind.config.js`
3. **Additional Controls**: Create new components
4. **Themes**: Implement theme switching

## 📄 License

MIT License - Feel free to use for your own presentations!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Vibe Coding community**

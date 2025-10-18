# Component System Documentation

This project uses a dynamic component loading system to make header and footer reusable across multiple pages.

## File Structure

```
Project/
├── components/
│   ├── header.html          # Header component
│   ├── footer.html          # Footer component
│   └── README.md           # This documentation
├── js/
│   └── components.js       # Component loader system
└── index.html              # Main page using components
```

## How It Works

### 1. Component Files
- **`components/header.html`**: Contains the complete header HTML structure
- **`components/footer.html`**: Contains the complete footer HTML structure with inline styles

### 2. Component Loader (`js/components.js`)
- Automatically loads components when the page loads
- Caches components for better performance
- Handles errors gracefully
- Provides a clean API for manual component loading

### 3. Usage in HTML Pages

#### Automatic Loading (Recommended)
Add placeholder divs with `data-include` attributes:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <!-- Header will be automatically loaded here -->
    <div data-include="header"></div>
    
    <!-- Your page content -->
    <main>
        <h1>Your Content</h1>
    </main>
    
    <!-- Footer will be automatically loaded here -->
    <div data-include="footer"></div>
    
    <!-- Include the component loader before other scripts -->
    <script src="js/components.js" defer></script>
    <script src="main.js" defer></script>
</body>
</html>
```

#### Manual Loading
You can also load components manually:

```javascript
// Load header into a specific element
ComponentLoader.includeComponent('header', 'components/header.html', '#header-container');

// Replace content with a component
ComponentLoader.replaceWithComponent('footer', 'components/footer.html', '#footer-container');
```

## Creating New Pages

To create a new page that uses the same header and footer:

1. **Create your HTML file** (e.g., `about.html`, `contact.html`)
2. **Add the component placeholders**:
   ```html
   <div data-include="header"></div>
   <!-- Your content -->
   <div data-include="footer"></div>
   ```
3. **Include the component loader script**:
   ```html
   <script src="js/components.js" defer></script>
   ```
4. **Include your CSS and other scripts as needed**

## Benefits

- ✅ **DRY Principle**: No code duplication
- ✅ **Easy Maintenance**: Update header/footer in one place
- ✅ **Consistent Design**: All pages automatically use the same components
- ✅ **Performance**: Components are cached after first load
- ✅ **Error Handling**: Graceful fallbacks if components fail to load
- ✅ **Flexible**: Can be used for any reusable HTML components

## Customization

### Adding New Components
1. Create a new HTML file in the `components/` folder
2. Add a placeholder div with `data-include="component-name"`
3. The system will automatically load it

### Modifying Existing Components
- Edit the files in `components/header.html` or `components/footer.html`
- Changes will automatically apply to all pages using the components

### Advanced Usage
The `ComponentLoader` class provides additional methods:
- `loadComponent(name, path)`: Load and cache a component
- `includeComponent(name, path, target, position)`: Include component at specific position
- `replaceWithComponent(name, path, target)`: Replace target content with component

## Browser Support
- Modern browsers with ES6+ support
- Uses Fetch API for loading components
- Graceful degradation for older browsers

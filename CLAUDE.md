# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Chrome extension that creates a custom new tab page with the following features:
- Custom search bar with Google and Bing search engine options
- Bookmark bar displaying Chrome bookmarks
- Time and date display with both solar and lunar calendars
- Left-side menu with quick access to various tools (calculator, notes, todo, weather, etc.)
- Responsive design with modern UI elements

## File Structure
- `manifest.json` - Chrome extension manifest file
- `newtab.html` - Main HTML structure for the new tab page
- `newtab.css` - Styling for the new tab page
- `newtab.js` - JavaScript functionality for all features
- `icons/` - Extension icons in various sizes
- `pic/` - Background images

## Architecture Overview
The extension follows a simple client-side architecture:
1. The HTML provides the basic structure with containers for all UI elements
2. CSS provides styling with a focus on modern, clean design and responsive layout
3. JavaScript handles all functionality including:
   - Search engine switching and search execution
   - Bookmark retrieval and display with folder support
   - Time/date updates with lunar calendar conversion
   - Menu system with popup panels for various tools
   - Event handling for all interactive elements

## Key Components
1. **Search System**: Supports switching between Google and Bing search engines
2. **Bookmark System**: Displays Chrome bookmarks with folder hierarchy and popup menus
3. **Time Display**: Shows current time and date with both solar and lunar calendar
4. **Tool Menu**: Left-side menu providing access to various utilities
5. **Popup System**: Modal dialogs for various features

## Development Notes
- This is a Chrome extension using Manifest V3
- Uses Chrome APIs for bookmarks and tabs
- Relies on Bootstrap Icons for UI icons
- Background images are loaded from the `pic/` directory
- All functionality is contained in a single HTML file with external CSS and JS

## No Build Required
This is a simple Chrome extension with no build process. Files can be loaded directly into Chrome as an unpacked extension for development and testing.
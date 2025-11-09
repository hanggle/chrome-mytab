# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Chrome extension that creates a custom new tab page with the following features:
- Custom search bar with Google and Bing search engine options
- Bookmark bar displaying Chrome bookmarks with folder hierarchy
- Time and date display with both solar and lunar calendars
- Left-side menu with quick access to various tools (calculator, notes, todo, weather, etc.)
- Modal system for tool popups and extended functionality
- Responsive design with modern UI elements

## File Structure
- `manifest.json` - Chrome extension manifest file (Manifest V3)
- `newtab.html` - Main HTML structure for the new tab page with modal system
- `newtab.css` - Styling for the new tab page with background image support
- `newtab.js` - JavaScript functionality for all features including Chrome API integration
- `icons/` - Extension icons in various sizes (16, 48, 128px)
- `pic/` - Background images (default: background.jpg)

## Architecture Overview
The extension follows a simple client-side architecture:

**HTML Structure**:
- Single-page application with modular containers for UI components
- Modal system for popup tools and extended functionality
- Semantic structure with bookmark containers, search interface, and time displays

**JavaScript Architecture** (newtab.js):
- Event-driven architecture with DOMContentLoaded initialization
- Chrome API integration for bookmarks (chrome.bookmarks.getTree)
- Search engine management with configurable URLs
- Real-time clock and calendar updates
- Modal management system for tool popups
- Bookmark folder hierarchy rendering with popup menus

**CSS Architecture**:
- Background image system with overlay for readability
- Responsive layout with flexbox and CSS Grid
- Component-based styling for bookmark bars, search interface, and modals
- Bootstrap Icons integration for UI elements

## Key Components
1. **Search System**: Dual search engine support (Google/Bing) with instant switching
2. **Bookmark System**: Chrome bookmarks API integration with folder navigation and popup menus
3. **Time Display**: Real-time clock with solar/lunar calendar conversion
4. **Modal System**: Centralized popup management for tools and extended features
5. **Tool Menu**: Left-side menu providing access to various utilities

## Development Notes
- Chrome Extension Manifest V3 with permissions for bookmarks, favicon, and windows
- Uses Chrome APIs for bookmark retrieval and management
- Bootstrap Icons loaded via CDN for UI icons
- Background images loaded from local `pic/` directory with fallback handling
- No build process - direct file loading for development
- Modal-based architecture for extending functionality without page navigation

## Testing and Development
Load extension as unpacked in Chrome Developer Mode:
1. Open Chrome Extensions page (chrome://extensions/)
2. Enable Developer mode
3. Click "Load unpacked" and select the project directory
4. Test by opening new tab (Ctrl+T or Cmd+T)
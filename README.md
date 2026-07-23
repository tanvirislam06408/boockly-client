# Boockly Client

A modern web application for browsing, searching, and managing books. Built with React and powered by the Gutendex API (Project Gutenberg's API), Boockly provides a beautiful interface for discovering free e-books.

## Features

- **Book Browsing**: Explore a vast collection of free books from Project Gutenberg
- **Search Functionality**: Search books by title, author, or keywords with debounced search
- **Category Filtering**: Filter books by categories and topics
- **Book Details**: View detailed information about each book including ratings and descriptions
- **Rating System**: Rate books and see aggregated ratings (mock implementation)
- **Download Options**: Download books in various formats (EPUB, PDF, Plain Text)
- **EPUB Reader**: Built-in reader for EPUB files with advanced features
- **Admin Panel**: Manage books with a secure admin interface (upload, edit, delete)
- **Responsive Design**: Fully responsive UI that works on all device sizes

## Technologies Used

### Frontend
- **React 18** - A JavaScript library for building user interfaces
- **React Router DOM v7** - Client-side routing for single-page applications
- **Vite** - Next-generation frontend tooling for fast development and builds
- **Tailwind CSS v3** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful, consistent icons
- **Axios** - Promise-based HTTP client for API requests
- **EPUB.js** - JavaScript library for rendering EPUB files in the browser

### APIs
- **Gutendex API** - Project Gutenberg's API for accessing free e-books
- **Custom Backend API** - For admin functionality (configured via environment variables)

### Development Tools
- **ESLint** - Code linting for maintaining code quality
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - Automatically adds vendor prefixes to CSS

## Project Structure

```
boockly-client/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── BookGrid.jsx
│   │   ├── BookCard.jsx
│   │   ├── BookDetailsModal.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── SearchBar.jsx
│   │   ├── RatingStars.jsx
│   │   ├── Footer.jsx
│   │   ├── reader/        # EPUB Reader components
│   │   │   ├── EpubReader.jsx
│   │   │   ├── TableOfContents.jsx
│   │   │   ├── ReaderControls.jsx
│   │   │   ├── FontControls.jsx
│   │   │   ├── ThemeSelector.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── AdminUploadForm.jsx
│   │   └── AdminBooksTable.jsx
│   ├── pages/             # Route components
│   │   ├── Home.jsx       # Main book browsing page
│   │   ├── Admin.jsx      # Admin panel with authentication
│   │   ├── Reader.jsx     # EPUB reader page
│   │   └── NotFound.jsx   # 404 page
│   ├── services/          # API services
│   │   ├── api.js         # Gutendex API integration
│   │   └── readingProgress.js # localStorage reading progress
│   ├── data/              # Mock data
│   │   └── mockBooks.js   # Sample book data for admin
│   ├── App.jsx            # Root component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── .env                   # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boockly-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- **Custom color palette**: Brand (amber/copper), Olive (sage), and Parchment (cream) colors
- **Custom fonts**: Playfair Display for headings, Inter for body text
- **Custom shadows**: Card shadows for depth and elevation
- **Custom border radius**: Rounded cards for a modern look

### Environment Variables
- `VITE_API_URL` - Backend API URL for admin functionality

## Features in Detail

### EPUB Reader
- **Open EPUB files** directly from Gutendex download URLs
- **Responsive reading interface** that adapts to any screen size
- **Previous/Next page navigation** with arrow buttons and keyboard shortcuts
- **Table of contents sidebar** for easy chapter navigation
- **Font size controls** with increase/decrease buttons (70% to 150%)
- **Font family selector** with serif, sans-serif, monospace, and cursive options
- **Light, Dark, and Sepia themes** for comfortable reading in any environment
- **Reading progress bar** showing current page and total pages
- **Save reading progress** in localStorage with automatic resume
- **Continue reading from last position** when returning to a book
- **Fullscreen mode** for immersive reading experience
- **Keyboard navigation** using Arrow keys (Left/Right), F (fullscreen), T (TOC), Escape (close)
- **Mobile-friendly layout** with touch-friendly controls

#### How to Use the EPUB Reader
1. Browse books on the Home page
2. Click on a book to open the details modal
3. Click the "Read Book" button (available for EPUB files)
4. The reader will open with the book loaded
5. Use the navigation controls to move between pages
6. Click the menu icon to open the table of contents
7. Use the font and theme controls in the bottom toolbar
8. Your reading progress is automatically saved
9. When you return to the same book, you'll resume from where you left off

### Book Browsing
- Fetches books from Gutendex API with pagination support
- Displays book covers, titles, authors, and ratings
- Responsive grid layout that adapts to screen size

### Search & Filtering
- Real-time search with debounce (400ms delay)
- Category-based filtering using Gutendex topics
- Combined search and category filtering

### Book Details Modal
- Comprehensive book information display
- Download options in multiple formats (EPUB, PDF, Plain Text)
- Interactive rating system with optimistic updates

### Admin Panel
- Secure access with admin key authentication
- Session-based authentication using sessionStorage
- Book management: upload, edit, and delete operations
- Mock data for demonstration purposes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Gutendex API](https://gutendex.com/) - For providing access to Project Gutenberg's book collection
- [Project Gutenberg](https://www.gutenberg.org/) - For digitizing and archiving literary works
- [Tailwind CSS](https://tailwindcss.com/) - For the amazing utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - For the beautiful icon set

---

**Note**: This is a client-side application. For full functionality, a backend API server should be configured and running at the URL specified in the environment variables.
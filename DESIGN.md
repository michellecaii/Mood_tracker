# Design Documentation

## Design Philosophy

**Reflect** is a minimalist mood journal application designed with a focus on emotional self-awareness, privacy, and simplicity. The design philosophy centers around:

- **No Pressure**: No scores, ratings, or judgmental metrics
- **Visual Simplicity**: Clean, uncluttered interface that doesn't overwhelm
- **Emotional Clarity**: Color-coded emotions for quick visual recognition
- **Privacy First**: All data stored locally, no cloud dependencies
- **Gentle Guidance**: AI insights that support rather than prescribe

## Design System

### Color Palette

The application uses a soft, warm, minimal color palette with OKLCH color space for better perceptual uniformity:

#### Light Mode
- **Background**: `oklch(0.98 0.005 70)` - Soft, warm off-white
- **Foreground**: `oklch(0.22 0.015 280)` - Deep, muted text
- **Primary**: `oklch(0.18 0.02 280)` - Dark slate for emphasis
- **Secondary**: `oklch(0.92 0.01 70)` - Light warm gray
- **Muted**: `oklch(0.88 0.008 70)` - Subtle background elements
- **Border**: `oklch(0.9 0.008 70)` - Soft dividers

#### Emotion Colors
- **Happy**: `bg-yellow-100` - Warm, cheerful yellow
- **Calm**: `bg-blue-100` - Soothing blue
- **Peaceful**: `bg-emerald-100` - Tranquil green
- **Anxious**: `bg-purple-100` - Thoughtful purple
- **Sad**: `bg-indigo-100` - Deep, contemplative indigo
- **Angry**: `bg-red-100` - Intense but soft red

#### Dark Mode
- Full dark mode support with inverted color scheme
- Maintains the same emotional color associations
- Reduced contrast for comfortable nighttime use

### Typography

- **Primary Font**: Geist Sans (via Next.js Google Fonts)
- **Monospace Font**: Geist Mono (for code/technical elements)
- **Font Weights**: Light (300) for headings, Regular (400) for body text
- **Font Sizes**: Responsive scale from 0.875rem (14px) to 3rem (48px)

### Layout Principles

1. **Vertical Rhythm**: Generous spacing between sections (py-20, py-32)
2. **Max Width Constraints**: Content constrained to max-w-2xl or max-w-3xl for readability
3. **Responsive Design**: Mobile-first approach with breakpoints at md (768px)
4. **Centered Content**: Most content centered for focus
5. **Card-based Sections**: Visual separation using subtle cards with soft shadows

### Component Design

- **Buttons**: Ghost variants for navigation, solid dark for primary actions
- **Cards**: Soft shadows, rounded corners (0.625rem radius), subtle borders
- **Inputs**: Large, comfortable text areas with soft focus states
- **Timeline**: Horizontal blocks representing time, color-coded by emotion

## Tech Stack

### Frontend

- **Next.js 16.0.10** - React framework with App Router
  - Server Components and Client Components
  - API Routes for backend functionality
  - Built-in optimization and routing

- **React 19.2.0** - UI library
  - Hooks for state management (useState, useEffect)
  - Client-side interactivity

- **TypeScript 5** - Type safety
  - Full type coverage for components and API routes
  - Interface definitions for data structures

- **Tailwind CSS 4.1.9** - Utility-first CSS framework
  - Custom color palette via CSS variables
  - Responsive utilities
  - Dark mode support

- **Radix UI** - Accessible component primitives
  - Unstyled, accessible components
  - Used for: buttons, cards, dialogs, tooltips, etc.

- **date-fns 4.1.0** - Date manipulation and formatting
  - Formatting dates for display
  - Calculating time differences
  - Parsing ISO date strings

### Backend

- **Next.js API Routes** - Serverless API endpoints
  - `/api/entries` - CRUD operations for journal entries
  - `/api/entries/[id]` - Individual entry retrieval

- **better-sqlite3 11.7.0** - SQLite database driver
  - Synchronous database operations
  - Local file-based storage
  - Automatic schema creation

- **Google Gemini API (@google/generative-ai 0.21.0)** - AI insights generation
  - Generates 2-3 sentence summaries
  - Extracts 3-5 key themes
  - Fallback responses when API key is missing

### Development Tools

- **PostCSS 8.5** - CSS processing
- **Autoprefixer** - Vendor prefix automation
- **ESLint** - Code linting
- **Vercel Analytics** - Usage analytics (optional)

### UI Component Libraries

- **shadcn/ui** - Component system built on Radix UI
  - Fully customizable components
  - Copy-paste component architecture
  - TypeScript support

## Current Features

### Core Functionality

1. **Emotion Check-in**
   - 6 emotion options with color coding
   - Visual selection with hover states
   - Optional emotion tagging

2. **Free-form Reflection**
   - Large text area for unlimited writing
   - No character limits or restrictions
   - Auto-save on submission

3. **AI-Powered Insights**
   - Automatic summary generation (2-3 sentences)
   - Theme extraction (3-5 key themes)
   - Graceful fallback when API unavailable

4. **Emotional Patterns Timeline**
   - Last 7 days visualization
   - Time-based segmentation within days
   - Color-coded emotion blocks
   - Timestamp display on hover and below bars

5. **Theme Discovery**
   - Aggregated themes across all entries
   - Count of entries per theme
   - Top 6 most common themes displayed

6. **All Reflections Page**
   - Complete history view (`/reflections`)
   - Grouped by date
   - Full entry details with insights
   - Chronological organization

### User Experience Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode Support**: System preference detection
- **Smooth Scrolling**: Navigation with scroll-to-section
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error messages
- **Empty States**: Helpful messages when no data exists

## Known Bugs & Issues

### Current Bugs

1. **Date Grouping Inconsistency**
   - **Status**: Potential issue
   - **Description**: Entries from the same day may be split into separate groups if date strings differ slightly
   - **Impact**: Low - May cause duplicate "Today" entries in timeline
   - **Workaround**: Date normalization in grouping logic may need refinement

2. **Timeline Segment Width Calculation**
   - **Status**: Minor visual issue
   - **Description**: Segment widths for multiple entries per day may not perfectly represent time proportions
   - **Impact**: Low - Visual representation may be slightly off
   - **Note**: Minimum width of 8% ensures visibility but may distort time representation

3. **Debug Logging in Production Code**
   - **Status**: Code cleanup needed
   - **Description**: Debug instrumentation logs remain in `lib/ai.ts` and `app/api/entries/route.ts`
   - **Impact**: Low - Performance impact minimal, but should be removed
   - **Location**: 
     - `lib/ai.ts` (lines 3-5, 11-13, 21-23, 26-28, etc.)
     - `app/api/entries/route.ts` (lines 23-25, 27-29)

4. **Missing Error Boundaries**
   - **Status**: Enhancement needed
   - **Description**: No React error boundaries implemented
   - **Impact**: Medium - Unhandled errors could crash the entire app
   - **Recommendation**: Add error boundaries around major sections

5. **No Input Validation on Client Side**
   - **Status**: Enhancement needed
   - **Description**: Reflection text validation only happens on submit
   - **Impact**: Low - Server-side validation exists, but UX could be improved
   - **Recommendation**: Add real-time validation feedback

### Technical Debt

1. **Unused UI Components**: Many shadcn/ui components are installed but not used
2. **No Unit Tests**: No test coverage for components or utilities
3. **No E2E Tests**: No end-to-end testing setup
4. **Database Migrations**: No migration system for schema changes
5. **API Error Handling**: Could be more comprehensive with specific error types

## Future Enhancements

### Short-term (Next Sprint)

1. **Entry Editing**
   - Allow users to edit existing journal entries
   - Update AI insights when entries are modified
   - Visual indicator for edited entries

2. **Entry Deletion**
   - Soft delete with confirmation dialog
   - Option to permanently delete
   - Cascade delete for associated insights

3. **Search Functionality**
   - Full-text search across reflections
   - Filter by emotion, date range, or themes
   - Highlight search results

4. **Export Functionality**
   - Export entries as JSON
   - Export as PDF or Markdown
   - Bulk export options

5. **Improved Date Display**
   - Show full date format consistently
   - Relative dates ("2 days ago") vs absolute dates toggle
   - Calendar view option

### Medium-term (Next Quarter)

1. **Advanced Analytics**
   - Emotion trend charts over time
   - Weekly/monthly summaries
   - Pattern recognition notifications
   - Mood correlation analysis

2. **Custom Emotions**
   - Allow users to create custom emotion labels
   - Custom color associations
   - Emotion categories/tags

3. **Entry Templates**
   - Pre-defined reflection prompts
   - Customizable templates
   - Daily/weekly check-in templates

4. **Reminders & Notifications**
   - Configurable reminder times
   - Browser notifications (with permission)
   - Email reminders (optional)

5. **Multi-language Support**
   - i18n implementation
   - Support for multiple languages
   - Localized date formats

6. **Rich Text Editor**
   - Markdown support
   - Formatting options (bold, italic, lists)
   - Link embedding

7. **Media Attachments**
   - Image uploads for entries
   - Photo journaling capability
   - File attachment support

### Long-term (Future Vision)

1. **Cloud Sync (Optional)**
   - Encrypted cloud backup
   - Multi-device synchronization
   - Optional feature, not required

2. **Collaborative Features**
   - Share entries with trusted contacts
   - Group journaling (family, therapy groups)
   - Privacy controls per entry

3. **AI Enhancements**
   - Personalized reflection prompts
   - Mood prediction based on patterns
   - Therapeutic insights and suggestions
   - Integration with multiple AI providers

4. **Mobile App**
   - Native iOS/Android apps
   - Offline-first architecture
   - Push notifications
   - Widget support

5. **Integration Ecosystem**
   - Calendar integration
   - Health app integration (Apple Health, Google Fit)
   - Weather data correlation
   - Sleep tracking integration

6. **Advanced Visualization**
   - Interactive mood maps
   - 3D timeline visualization
   - Heat maps for emotional patterns
   - Customizable dashboard

7. **Therapist/Professional Features**
   - Secure sharing with mental health professionals
   - Progress reports
   - Anonymized data export for therapy sessions

8. **Gamification (Optional)**
   - Streak tracking
   - Achievement badges
   - Milestone celebrations
   - Optional feature toggle

## Future Updates

### Version 0.2.0 (Planned)

- Entry editing and deletion
- Search functionality
- Export to JSON/PDF
- Improved error handling
- Remove debug logging

### Version 0.3.0 (Planned)

- Advanced analytics dashboard
- Custom emotions
- Entry templates
- Reminder system

### Version 0.4.0 (Planned)

- Rich text editor
- Media attachments
- Multi-language support
- Enhanced AI insights

### Version 1.0.0 (Future)

- Mobile apps
- Cloud sync (optional)
- Professional features
- Full feature parity across platforms

## Architecture Decisions

### Why SQLite?

- **Local-first**: Privacy and offline capability
- **Simple**: No server setup required
- **Fast**: Synchronous operations for immediate feedback
- **Portable**: Database file can be backed up easily

### Why Next.js?

- **Full-stack**: API routes and frontend in one framework
- **Performance**: Built-in optimizations and SSR capabilities
- **Developer Experience**: Excellent TypeScript support
- **Deployment**: Easy deployment to Vercel or other platforms

### Why Google Gemini?

- **Free Tier**: Generous free usage limits
- **Quality**: Good balance of speed and insight quality
- **Reliability**: Stable API with good documentation
- **Fallback**: Graceful degradation when unavailable

### Why Tailwind CSS?

- **Rapid Development**: Utility classes speed up styling
- **Consistency**: Design system enforced through utilities
- **Performance**: Purged unused styles in production
- **Customization**: Easy theme customization via config

## Performance Considerations

### Current Optimizations

- **Static Generation**: Where possible, pages are statically generated
- **Code Splitting**: Automatic code splitting via Next.js
- **Image Optimization**: Next.js Image component for optimized images
- **Database Indexing**: Indexes on date and entry_id columns

### Future Optimizations

- **Pagination**: Implement pagination for large entry lists
- **Virtual Scrolling**: For timeline with many entries
- **Caching**: Implement caching strategy for API responses
- **Lazy Loading**: Lazy load reflections page
- **Database Optimization**: Query optimization and connection pooling

## Security Considerations

### Current Security Measures

- **Local Storage**: All data stored locally, no external servers
- **Input Sanitization**: Server-side validation of inputs
- **SQL Injection Prevention**: Parameterized queries via better-sqlite3
- **Environment Variables**: API keys stored in `.env.local` (gitignored)

### Future Security Enhancements

- **Encryption**: Encrypt sensitive data at rest
- **Rate Limiting**: API rate limiting for abuse prevention
- **Input Validation**: More comprehensive client and server-side validation
- **CSP Headers**: Content Security Policy implementation
- **HTTPS Only**: Enforce HTTPS in production

## Accessibility

### Current Accessibility Features

- **Semantic HTML**: Proper use of HTML5 semantic elements
- **ARIA Labels**: Radix UI components include ARIA attributes
- **Keyboard Navigation**: Full keyboard navigation support
- **Color Contrast**: WCAG AA compliant color contrasts
- **Focus States**: Visible focus indicators

### Future Accessibility Improvements

- **Screen Reader Testing**: Comprehensive testing with screen readers
- **Focus Management**: Improved focus management for modals and dialogs
- **Reduced Motion**: Respect prefers-reduced-motion
- **High Contrast Mode**: Support for high contrast themes
- **Voice Input**: Voice-to-text for reflections

## Browser Support

### Supported Browsers

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Known Limitations

- **SQLite**: Requires Node.js environment (not available in browser)
- **File System**: Database requires file system access
- **Service Workers**: Not currently implemented for offline support

---

**Last Updated**: January 2025
**Version**: 0.1.0
**Maintainer**: Reflect Development Team

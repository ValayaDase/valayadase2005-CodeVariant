# 🌿 Spotwise — Find Your Kind of Quiet

**An interactive workspace discovery platform that helps you find the right place to study, work, and focus.**

Spotwise helps users discover suitable workspaces based on their preferences, including noise levels, crowd conditions, facilities, budget, and time of visit. With interactive venue discovery, suitability scoring, location-aware maps, and community-driven reports, Spotwise makes finding the right environment easier.

Built with a focus on usability, visual aesthetics, and interactive experiences, Spotwise also adapts to the **Canvas Protocol** surprise challenge by transforming primary actions into a drag-and-drop interaction model.

## 🌐 Live Demo

**Deployed Application:** https://spot-wise.netlify.app/

---

## ✨ Project Overview

Finding a suitable place to study or work can be difficult when information about noise, crowd levels, seating, Wi-Fi, and other facilities is scattered or unavailable.

Spotwise brings workspace discovery into one place, helping users explore venues, compare their suitability, understand available conditions, and make informed decisions about where and when to work.

The platform combines an elegant botanical-inspired interface with interactive maps, personalized venue matching, and a canvas-based interaction experience.

## 🎯 Key Features

### 🗺️ Interactive Workspace Discovery
- Explore available study spaces, libraries, cafes, and coworking venues.
- Search and filter venues according to supported preferences.
- View venue information, facilities, and suitability scores.
- Use interactive map markers to explore venue locations.
- Display location-based distances when valid coordinates and user location are available.

### 🎯 Suitability Matching
- Match venues against user preferences.
- Consider supported criteria such as noise, budget, Wi-Fi, power outlets, and seating.
- Display suitability scores to help users compare venues.
- Use available reports and estimates to communicate workspace conditions.

### 🕒 Quiet When
- Explore how venue suitability may vary by day and time.
- Use available time-based estimates to compare potential workspaces.
- Distinguish estimated conditions from verified, recent community reports.
- Represent insufficient evidence as unknown instead of inventing certainty.

### 💬 Community Intelligence
- Share structured information about venue conditions.
- Collect feedback on crowd levels, noise, seating, Wi-Fi, and other supported facilities.
- Help users make better decisions using available community reports.

### 🎨 Canvas Protocol — Surprise Challenge

Spotwise adapts to the Code Variant surprise challenge by introducing a drag-and-drop interaction model for covered primary actions.

Instead of relying on conventional action buttons, users drag relevant data cards into designated Action Zones to perform supported operations.

Examples include:
- **Save Space:** Drop a venue card into the designated zone to save it.
- **Compare Venues:** Drop compatible venue cards into the comparison zone.
- **Add to My Plan:** Drop a venue card into the planning zone.
- **Submit Report:** Drop a completed feedback card into the submission zone.
- **Remove from Saved:** Drop a saved venue into the designated removal zone.

The interface can provide visual feedback for valid and invalid drops, with appropriate confirmation and error handling.

Only actions actually implemented in the application should be considered complete.

### 🌿 Interactive UI and Motion
- Floating, organic navigation design.
- Animated navigation icons.
- Smooth page and card entrance transitions.
- Staggered venue-card animations.
- Refined hover and selection effects.
- Botanical leaf-inspired background decorations.
- Liquid-fill hover effects for suitable interactive elements.
- Responsive layouts designed around the existing Spotwise visual identity.

### 📍 Location Awareness
- Browser-based geolocation with user permission.
- Venue distance calculations using valid geographic coordinates.
- Manual location fallback when geolocation is unavailable, if configured.
- Custom venue markers and map selection interactions.

Straight-line geographic distance is distinct from actual road distance. Road distance and travel times require a supported routing service.

---

## 🛠️ Tech Stack

The exact stack depends on the libraries and integrations configured in the project.

| Category | Technology |
|---|---|
| Frontend | Next.js, React.js, JavaScript |
| Styling | CSS, existing project design tokens |
| Animations | Framer Motion / Motion, if installed |
| Icons | Lucide React, if installed |
| Interactive Maps | Leaflet, React Leaflet, if configured |
| Map Data | OpenStreetMap-compatible tile provider, if configured |
| Backend | Existing Next.js Route Handlers or configured API server |
| Database | MongoDB Atlas, if configured |
| Drag and Drop | Existing drag-and-drop library, such as `@dnd-kit/core` |

Remove or adjust technologies that are not actually present in your implementation.

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the application:

- Node.js (a version supported by your Next.js project)
- npm
- Git
- MongoDB Atlas credentials, if database functionality is enabled

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your actual repository URL and project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add only the variables required by your actual implementation. For example, if MongoDB Atlas is configured:

```env
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your actual connection string.

**Security notes:**
- Never commit `.env.local` to Git.
- Never expose database credentials in frontend code.
- Do not use the `NEXT_PUBLIC_` prefix for private database credentials.
- Configure appropriate database access controls and network restrictions.
- Only add additional environment variables when the corresponding service is implemented.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed by Next.js, usually:

```text
http://localhost:3000
```

### 5. Build for production

```bash
npm run build
npm run start
```

Run the commands from the project root.

---

## 🧭 How to Use Spotwise

1. Open Spotwise and navigate to the discovery experience.
2. Search for venues and select supported preferences.
3. Explore the available venues through cards and the interactive map.
4. Review venue information, suitability scores, and available conditions.
5. Allow location access if you want location-based distance calculations.
6. Use the Canvas Protocol Action Zones to perform supported primary actions.
7. Submit structured community feedback using the implemented drag-and-drop workflow.
8. Explore saved venues and planning features if they are enabled in the application.

Some features may require database configuration, location permission, or additional service setup.

---

## 🎨 Design Philosophy

Spotwise follows a calm, organic visual language inspired by botanical spaces and focused work environments.

**Visual principles:**
- Warm ivory surfaces.
- Sage-green accents.
- Forest-green typography.
- Softly rounded panels.
- Subtle botanical illustrations.
- Purposeful motion and interaction feedback.
- Clear hierarchy and readable venue information.

The objective is to make workspace discovery feel intuitive, engaging, and visually memorable without sacrificing usability.

---

## 🔐 Privacy and Data Handling

- Browser geolocation requires user permission.
- Location-dependent features should handle denied or unavailable permissions gracefully.
- Private database credentials must remain server-side.
- User-submitted reports should be validated before persistence.
- Database operations should enforce appropriate authentication and authorization.
- Demo venue data and synthetic telemetry should be clearly identified as demo data.
- Predictions should communicate their evidence and uncertainty appropriately.

Refer to the application's actual privacy and data-handling implementation for complete details.

---

## 🧪 Testing

Run the checks configured in the project:

```bash
npm run lint
npm run build
```

If available, also run the project's automated test suite.

Recommended manual checks:
- Venue search and filtering.
- Map marker selection and venue-card synchronization.
- Geolocation permission handling.
- Distance calculations.
- Navigation and animated icon behavior.
- Drag-and-drop Action Zones.
- Successful and invalid drops.
- Feedback validation and persistence.
- Responsive behavior.
- Reduced-motion accessibility.

Only report tests as passing after they have actually been executed.

---

## 🔮 Future Enhancements

Potential improvements include:

- More advanced venue recommendation models.
- Better historical crowd and noise forecasting.
- Routing integration for walking and driving distances.
- Enhanced map styling and venue clustering.
- More sophisticated accessibility support.
- Expanded community reporting and moderation.
- Improved real-time venue discussions.
- More advanced interactive canvas workflows.

These are future possibilities and are not necessarily implemented in the current version.

---

## 🏆 Surprise Challenge: The Canvas Protocol

The Canvas Protocol challenges developers to rethink conventional user interactions.

Spotwise responds by turning primary actions into spatial interactions: users move meaningful data cards into designated zones rather than simply clicking standard action buttons.

This approach explores a more tactile and visual interaction model while preserving the platform's central purpose—helping users find the right environment for focused work.

---


## 📄 License

Add the license appropriate to your project and any third-party assets or libraries you use.

---

**Spotwise — Your space. Your pace. Your focus.** 🌿

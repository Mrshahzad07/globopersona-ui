# Globopersona

An AI-powered email campaign management platform built with React. Manage contacts, organize email lists, create targeted campaigns with an AI-assisted workflow, and track performance with real-time analytics.

## Features

- **Dashboard** — Live campaign metrics, performance trends, and rate cards with animated progress bars
- **Campaign Management** — Create, pause, resume, and delete campaigns with filtering and status tracking
- **6-Step Campaign Wizard** — Guided workflow: campaign setup → audience targeting → CSV upload → AI email generation → spam validation → launch
- **Email Lists** — Dedicated dashboard for managing segmented email lists with full CRUD, contact tables, search, inline editing, and contact growth trends chart
- **Contact Management** — CSV import with field mapping, email validation, duplicate detection, and contact selection
- **Analytics** — Line charts, bar charts, pie charts with date range filtering and exportable data
- **Dark Mode** — Full dark theme support across every page and component
- **Responsive Layout** — Collapsible sidebar on desktop, hamburger menu on tablets and phones
- **Notifications** — Bell icon dropdown with read/unread tracking and localStorage persistence
- **Indianized Data** — All sample data uses Indian names, companies (Infosys, TCS, Flipkart, Zomato, etc.), and context

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router DOM 7 |
| Styling | Custom CSS with design tokens (CSS variables) |
| Charts | Recharts |
| Icons | Lucide React |
| CSV Parsing | PapaParse |
| State | React Context API + hooks |
| Storage | localStorage (mock persistence) |

## Getting Started

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**

### Demo Login

Use any email and password — the app uses mock authentication for demonstration.

## Project Structure

```
src/
├── components/
│   ├── Campaigns/        # CSV upload, field mapping, AI strategist modals
│   ├── Common/           # LoadingSpinner, EmptyState, ErrorBoundary
│   └── Layout/           # MainLayout, Sidebar, Header
├── contexts/             # AuthContext, ThemeContext
├── pages/
│   ├── Dashboard.jsx     # Metrics, charts, recent campaigns
│   ├── Campaigns/
│   │   ├── CampaignList.jsx
│   │   ├── CampaignDetails.jsx
│   │   └── CreateCampaign/
│   │       ├── WizardContainer.jsx
│   │       ├── Step1_CampaignInfo.jsx
│   │       ├── Step2_TargetAudience.jsx
│   │       ├── Step3_UploadContacts.jsx
│   │       ├── Step4_EmailGeneration.jsx
│   │       ├── Step5_Validation.jsx
│   │       └── Step6_Launch.jsx
│   ├── EmailLists/
│   │   ├── EmailListDashboard.jsx
│   │   └── EmailListDetails.jsx
│   ├── Contacts/         # Contact list with add/delete/import
│   ├── Analytics/        # Performance charts and breakdowns
│   └── Settings/         # App preferences
├── services/
│   └── mockApi.js        # Mock API with localStorage backend
├── index.css             # Design system, utilities, global styles
├── App.jsx
└── main.jsx
```

## Pages

### Dashboard
Displays key campaign metrics (sent emails, open/click/reply rates), performance trend charts, campaign status distribution, and a list of recent campaigns.

### Campaigns
Browse all campaigns in a filterable card grid. Each card shows contacts count, sent count, open rate, and click rate. Create new campaigns through either a 6-step manual wizard or an AI-assisted chatbot.

### Email Lists
A dedicated management dashboard for email contact lists with indianized sample data. Features include:
- **Dashboard Overview** — Animated metric cards showing total lists, contacts, data fields, and averages
- **Contact Growth Chart** — Smooth area chart displaying contact growth trends over 5 months with gradient fills
- Card grid overview with contact and field counts per list
- Quick search across all lists
- Create new lists with name and description
- Click into any list to view all contacts in a sortable table
- Add or remove individual contacts from a list
- Inline edit list name and description
- Sample data includes Indian companies (Infosys, TCS, Wipro, Flipkart, Zomato, Swiggy, Razorpay, CRED) and Indian names

### Campaign Wizard
The 6-step wizard walks users through creating a campaign:
1. **Campaign Info** — Name, description, goals, and category
2. **Target Audience** — Industry, company size, job role targeting
3. **Upload Contacts** — Drag-and-drop CSV with field mapping and email list management
4. **Email Generation** — AI-assisted email template creation and editing
5. **Validation** — Spam score check, deliverability analysis, content review
6. **Launch** — Scheduling, send volume, and final review before sending

### Analytics
Interactive charts showing open rates, click rates, reply rates over time. Includes campaign status breakdown (pie chart), performance comparison (bar chart), and date range filtering.

### Contacts
Upload and manage individual contacts. Supports CSV import with automatic field mapping, email validation, duplicate detection, and tag-based filtering.

## Design System

Built on CSS custom properties for consistent theming:

- **Colors**: Indigo primary (`#6366f1`), purple accent (`#9333ea`), semantic success/warning/error
- **Typography**: System font stack with defined scale
- **Spacing**: 4px base unit grid
- **Components**: Buttons, cards, forms, badges, modals, tables, progress bars
- **Animations**: Fade-in, slide-up, shimmer, and count-up effects

## Deployment

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.). Configure the server to redirect all routes to `index.html` for SPA routing.

For backend integration, set environment variables:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

## Roadmap

- Backend API integration (Node/Express or Spring Boot)
- OpenAI GPT integration for email generation
- Email delivery via SendGrid or AWS SES
- Real-time campaign tracking with WebSockets
- A/B testing and multivariate campaigns
- Team roles and collaboration
- Advanced reporting and CSV exports

## License

MIT

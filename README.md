# GST Automation Software

A full-stack web application for automating GST compliance for e-commerce sellers. Supports 10+ e-commerce platforms, generates Tally XML, GSTR-1 JSON, and comprehensive reports.

## Features

- **Multi-Platform Support**: Import data from Amazon, Flipkart, Meesho, Myntra, Glowroad, Jio Mart, LimeRoad, Snapdeal, Shop 101, Paytm
- **Bank Statement Parsing**: Upload PDF bank statements and extract transactions automatically
- **GSTR-1 Generation**: Auto-generate GSTR-1 compliant JSON with Table 14 & 15 support
- **Tally XML Export**: Generate Tally Prime compatible XML files with proper voucher structure
- **Comprehensive Reports**: HSN-wise, state-wise, GST rate-wise, and platform-wise summaries
- **User Authentication**: JWT-based auth with email/WhatsApp login and role management

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Dropzone (file uploads)
- Chart.js (data visualization)

### Backend
- Node.js + Express.js
- TypeScript
- PostgreSQL
- JWT Authentication
- Multer (file handling)
- xlsx, pdf-parse, xml2js

## Project Structure

```
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── page.tsx     # Landing page
│   │   │   ├── login/       # Authentication
│   │   │   ├── register/
│   │   │   ├── dashboard/   # Main application
│   │   │   ├── pricing/
│   │   │   ├── features/
│   │   │   ├── contact/
│   │   │   └── demo/
│   │   └── components/      # Reusable UI components
│   └── package.json
│
├── backend/                  # Express.js server
│   ├── src/
│   │   ├── server.ts        # Main entry point
│   │   ├── config/          # Database config
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, error handling
│   │   └── migrations/      # Database schema
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Create database**
```bash
createdb gst_automation
```

4. **Run migrations**
```bash
psql -d gst_automation -f src/migrations/001_initial_schema.sql
```

5. **Create uploads directory**
```bash
mkdir uploads
```

6. **Start server**
```bash
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/WhatsApp |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### File Uploads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/uploads` | Upload file for processing |
| GET | `/api/uploads` | List user uploads |
| GET | `/api/uploads/:id/status` | Get processing status |
| GET | `/api/uploads/:id/transactions` | Get parsed transactions |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/generate` | Generate report (XML/JSON/CSV) |
| GET | `/api/reports` | List user reports |
| GET | `/api/reports/:id/download` | Download report file |

## Supported File Formats

- **CSV** (.csv) - E-commerce reports, sales data
- **Excel** (.xlsx, .xls) - Order reports, inventory data
- **PDF** (.pdf) - Bank statements (OCR parsing)
- **JSON** (.json) - API exports, structured data

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gst_automation

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Subscription Plans

| Plan | Price | Assessees | Features |
|------|-------|-----------|----------|
| Light | ₹3,900/yr | 100 | 5 platforms, Email support |
| Popular | ₹4,900/yr | 250 | 10 platforms, Bulk processing |
| Professional | ₹8,000/yr | Unlimited | All platforms, API access |

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet security headers
- File type validation
- SQL injection prevention (parameterized queries)

## License

MIT License

## Support

- Email: support@gstpro.in
- Phone: +91 98765 43210

# Tailer - Transparent Betting Platform

A social platform where bettors post verified bet slips before games start. AI checks timestamps and results to ensure transparency. Bets can't be edited or deleted, and every outcome updates public stats like win %, ROI, profit, and streaks.

## 🎯 Key Features

### Core Transparency Features
- **Immutable Bets**: Once submitted, bets cannot be edited or deleted
- **AI Verification**: Every bet is verified by AI to ensure timestamps are before game start
- **Pre-Game Submission**: Bets must be submitted before kickoff
- **Public Statistics**: All user stats (win %, ROI, profit, streaks) are publicly viewable

### Subscription System
- **Free Stats Viewing**: Anyone can view creator statistics for free
- **Premium Picks**: Subscribe to see picks before games start
- **Creator Pricing**: Creators set their own subscription price
- **Stripe Integration**: Platform takes a percentage through Stripe

### Statistics Tracked
- Win percentage
- ROI (Return on Investment)
- Total profit/loss
- Win/loss streaks (current and longest)
- Total bets and outcomes (won/lost/push/pending)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/William-2614/Tailer-D1.git
cd Tailer-D1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for authentication
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `PLATFORM_FEE_PERCENTAGE`: Platform fee (default: 10)

4. Set up the database:
```bash
npm run prisma:push
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── bets/           # Bet management endpoints
│   │   ├── stats/          # Statistics endpoints
│   │   └── subscriptions/  # Subscription endpoints
│   ├── bets/               # Bets listing page
│   ├── creators/           # Creators directory
│   ├── profile/            # User profile pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── lib/                     # Utility libraries
│   ├── ai/                 # AI verification
│   ├── prisma/             # Database client
│   ├── stats/              # Statistics calculator
│   └── stripe/             # Stripe integration
├── prisma/
│   └── schema.prisma       # Database schema
└── components/             # React components
```

## 🔒 Security & Transparency

### Immutability
- Bets cannot be edited after submission (enforced at API level)
- Delete operations return 405 Method Not Allowed
- All bet details are stored with timestamps

### AI Verification
- Timestamp verification ensures bets are submitted before events
- Verification data is stored with each bet
- Invalid bets are rejected at submission

### Public Accountability
- All statistics are publicly viewable
- Stats auto-update after each bet result
- No manual stat manipulation possible

## 💳 Subscription & Payments

### For Subscribers
1. View any creator's public stats for free
2. Subscribe to access picks before kickoff
3. Monthly billing through Stripe
4. Cancel anytime

### For Creators
1. Set your own monthly subscription price
2. Post verified bets before games
3. Build transparent track record
4. Earn from subscribers (platform takes percentage)

### Platform Fee
- Default: 10% of subscription revenue
- Configurable via `PLATFORM_FEE_PERCENTAGE`
- Handled automatically through Stripe

## 🛠️ API Endpoints

### Bets
- `POST /api/bets` - Create new bet (immutable)
- `GET /api/bets` - List bets (with filters)
- `GET /api/bets/[id]` - Get specific bet
- `PATCH /api/bets/[id]` - Update bet result only
- `DELETE /api/bets/[id]` - Not allowed (405)

### Statistics
- `GET /api/stats/[userId]` - Get public statistics

### Subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions` - List subscriptions

## 📊 Database Schema

Key models:
- **User**: User accounts and creator settings
- **Bet**: Immutable bet records with verification
- **UserStatistics**: Auto-calculated stats
- **Subscription**: Stripe-integrated subscriptions
- **Payment**: Payment tracking

See `prisma/schema.prisma` for complete schema.

## 🧪 Development

### Run Prisma Studio
```bash
npm run prisma:studio
```

### Build for Production
```bash
npm run build
npm start
```

## 📝 License

ISC

## 🤝 Contributing

This is a personal project, but suggestions are welcome via issues.

---

Built with Next.js, TypeScript, Prisma, and Stripe

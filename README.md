# Saim

An AI-powered sales assistant that engages website visitors, answers questions about your business, qualifies leads, and captures email addresses for follow-up.

## Features

- **AI-Powered Chat**: Uses Anthropic's Claude Sonnet 4-6 for intelligent conversations
- **Website Scraping**: Automatically scrapes your website to provide the AI with context about your business
- **Lead Qualification**: AI naturally qualifies visitors by understanding their needs, budget, and timeline
- **Email Capture**: Automatically captures leads and stores them in Supabase
- **Conversation History**: Maintains context across multiple sessions
- **Customizable Persona**: Define how your AI assistant behaves and responds
- **Real-time Chat Widget**: Clean, modern chat interface that can be embedded on any website

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: React 19, Tailwind CSS
- **AI**: [Anthropic Claude](https://www.anthropic.com) (Claude Sonnet 4-6)
- **Database**: [Supabase](https://supabase.com)
- **Scraping**: Cheerio

## Prerequisites

- Node.js 18+
- Supabase account
- Anthropic API key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sales-agent
```

2. Install dependencies:

```
bash
npm install
# or
pnpm install
```

3. Set up environment variables:

```
bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```
env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to set up the database:

```
sql
-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  scraped_content TEXT,
  agent_persona TEXT DEFAULT 'helpful and friendly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  business_id UUID REFERENCES businesses(id),
  messages JSONB DEFAULT '[]',
  lead_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage

1. Start the development server:

```
bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. To embed the chat widget on your website, add the ChatWidget component with your business ID:

```
tsx
import ChatWidget from "@/app/components/ChatWidget";

<ChatWidget businessId="your-business-id-from-supabase" />
```

## API Endpoints

### POST /api/chat

Send a chat message to the AI assistant.

**Request Body:**

```
json
{
  "message": "What services do you offer?",
  "sessionId": "unique-session-id",
  "businessId": "business-id-from-supabase"
}
```

**Response:**

```
json
{
  "reply": "AI response text",
  "leadCaptured": false
}
```

### POST /api/scrape

Scrape a business website for content.

**Request Body:**

```
json
{
  "url": "https://example.com",
  "businessId": "business-id-from-supabase"
}
```

**Response:**

```
json
{
  "success": true,
  "preview": "First 200 characters of scraped content"
}
```

## How It Works

1. **Business Setup**: Create a business record in Supabase with your company name and website URL
2. **Content Scraping**: Call the `/api/scrape` endpoint to fetch and store your website content
3. **Visitor Engagement**: Visitors chat with the AI assistant on your website
4. **AI Processing**: Claude processes the conversation using:
   - Your business context (scraped content)
   - Custom persona instructions
   - Conversation history
5. **Lead Capture**: When the AI captures an email, it's stored in the conversations table

## Environment Variables

| Variable                        | Description               |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key    |
| `ANTHROPIC_API_KEY`             | Your Anthropic API key    |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

```
bash
vercel deploy
```

## License

MIT

## Pricing & currencies

Prices live in one place: `src/lib/plans.ts` (`priceUSD` / `priceNGN`).

- **Landing page:** visitors in Nigeria see naira, everyone else sees dollars (via Vercel's `x-vercel-ip-country` header). A toggle lets anyone switch, and their choice is saved in a cookie.
- **Dashboard & billing:** show naira only until USD billing is turned on, so the price shown always matches the price charged.

To turn on USD billing:

1. Enable USD on your Paystack account.
2. Create three monthly USD plans in Paystack ($12, $29, $59).
3. Add their plan codes to your Vercel env vars:

```env
NEXT_PUBLIC_PAYSTACK_PLAN_STARTER_USD=PLN_xxx
NEXT_PUBLIC_PAYSTACK_PLAN_PRO_USD=PLN_xxx
NEXT_PUBLIC_PAYSTACK_PLAN_SCALE_USD=PLN_xxx
```

Once all three are set, the currency toggle appears on the dashboard and billing pages and USD checkout works.

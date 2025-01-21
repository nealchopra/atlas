<p align="center">
  <img src="/public/atlas-logo.png" alt="Atlas Logo" width="200" style="border-radius: 10px;" />
</p>

# Atlas – Research, faster.

Atlas is an AI-powered research paper analysis and organization tool that helps researchers streamline their literature review process. It combines paper search capabilities with AI analysis and project organization features to make research more efficient and insightful. This was built for DALI 2025 application (API developer challenge), by [Neal Chopra '28](https://nealchopra.com).

## Features

- **Smart paper search**: Search and retrieve papers via Semantic Scholar API.
- **AI analysis**: Get instant AI-powered summaries, key findings, and insights.
- **Project organization**: Create projects to organize related papers and analyses.
- **Comprehensive analysis**: Each paper analysis includes:
  - Tags for quick categorization
  - Concise summary
  - Key findings and contributions
  - Methodology overview
  - Limitations and weaknesses
  - Future research directions
  - Field impact assessment
- **Recent analyses**: Keep track of your recently analyzed papers

## Check out the demo [here](https://screen.studio/share/yGdgc7IE).

<p align="center">
  <a href="https://screen.studio/share/yGdgc7IE">
  <img src="/public/atlas-demo-image.png" alt="Atlas Demo" width="800" style="border-radius: 10px;" />
</p>

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL + Authentication)
- **AI**: OpenAI GPT-4o-mini
- **API integration**: Semantic Scholar
- **State management**: SWR for data fetching
- **Deployment**: Vercel

## Local development setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/atlas.git
cd atlas
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learning journey

### Inspiration

While researching for a class, I found myself spending countless hours manually analyzing research papers and organizing my literature reviews. I wanted to create a tool that would automate the tedious parts of research while maintaining the high quality expected in academic work.

### Potential impact

Atlas has the potential to:

- Save researchers valuable time in literature review
- Provide more consistent and comprehensive paper analysis
- Make academic research more accessible to students and early-career researchers
- Foster better organization and collaboration in research projects

### New technologies

1. **Next.js App Router in a monorepo**:

   - Server components and streaming
   - New routing patterns
   - API route handlers
   - Monorepo setup

Note: I have used Next.js App Router before, but this was the first time I used it in a monorepo (usually separate frontend and backend).

2. **OpenAI API**:
   - Prompt engineering for research paper analysis
   - Handling rate limits and token optimization
   - Structured output formatting

### Tech stack choices

- Chose **Supabase** for its combination of authentication, database, and real-time features.
- Selected **Next.js 15** for great performance and developer experience with the App Router.
- Used **Shadcn UI** for its accessible, customizable components that speed up development.
- Implemented **SWR** for its elegant data fetching and caching capabilities.

### Challenges and learnings

1. **Complex state management**:

   - Challenge: Managing paper analysis state across multiple components
   - Solution: Implemented custom hooks and SWR for better state organization
   - Learning: The importance of proper state architecture in complex applications

2. **Database security**:

   - Challenge: Implementing proper access controls for multi-user environment.
   - Solution: Carefully designed RLS policies and database structure
   - Learning: The complexity of securing user data in a collaborative environment

3. **Notion integration pivot**:
   - Challenge: Originally planned to integrate with Notion for note organization
   - Solution: Based on user feedback, pivoted to in-app note management instead
   - Learning: The importance of validating integration assumptions with actual users

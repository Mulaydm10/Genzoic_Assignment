export interface NewsHeadline {
  title: string;
  description: string;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: string;
}

export async function fetchNewsHeadlines(ticker: string): Promise<NewsHeadline[]> {
  // For production, this would integrate with a real news API
  // For now, return structured mock data based on ticker
  const mockNews = generateMockNews(ticker);
  return mockNews;
}

function generateMockNews(ticker: string): NewsHeadline[] {
  const companyNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'TSLA': 'Tesla, Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
  };

  const companyName = companyNames[ticker] || `${ticker} Corporation`;
  const now = new Date();
  
  const newsTemplates = [
    {
      title: `${companyName} Reports Strong Quarterly Results`,
      description: `${companyName} exceeded analyst expectations with robust revenue growth and positive outlook for the coming quarter.`,
      sentiment: "positive" as const,
      hoursAgo: 2,
    },
    {
      title: `${companyName} Announces Strategic Partnership`,
      description: `The company has formed a strategic alliance to expand its market reach and enhance its product offerings.`,
      sentiment: "positive" as const,
      hoursAgo: 4,
    },
    {
      title: `Market Analysts Upgrade ${ticker} Rating`,
      description: `Several major investment firms have upgraded their price targets following strong performance indicators.`,
      sentiment: "positive" as const,
      hoursAgo: 6,
    },
    {
      title: `${companyName} Faces Regulatory Scrutiny`,
      description: `Regulatory bodies are examining the company's practices, potentially impacting future operations.`,
      sentiment: "negative" as const,
      hoursAgo: 8,
    },
    {
      title: `${companyName} Maintains Steady Growth`,
      description: `The company continues to show consistent performance metrics in line with market expectations.`,
      sentiment: "neutral" as const,
      hoursAgo: 12,
    },
  ];

  return newsTemplates.slice(0, 5).map((template, index) => ({
    title: template.title,
    description: template.description,
    sentiment: template.sentiment,
    timestamp: new Date(now.getTime() - template.hoursAgo * 60 * 60 * 1000).toISOString(),
  }));
}

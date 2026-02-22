
export async function newsLoader() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  
  try {
    
    const topics = [
      'financial_markets',
      'finance',
      'economy_macro',
      'economy_monetary',
      'economy_fiscal',
    ].join(',');
    const url =
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT` +
      `&topics=${encodeURIComponent(topics)}` +
      `&sort=LATEST` +
      `&limit=50` +
      `&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }
    
    // Extract feed from response
    const feed = data.feed || [];
    
    if (!Array.isArray(feed) || feed.length === 0) {
      return [];
    }
    
    // Return top 5 global finance articles
    return feed
      .filter((article) => article && article.title && article.url)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}

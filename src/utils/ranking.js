export function rankItems(items, weights = {}) {
  const defaults = {
    rating: 0.4,
    popularity: 0.3,
    recency: 0.2,
    aiScore: 0.1
  };
  const w = { ...defaults, ...weights };

  return items
    .map(item => {
      const rating = item.rating || 3.5;
      const popularity = item.reviews_count || 10;
      const recency = item.date ? 1 / (1 + Math.abs(Date.now() - new Date(item.date))) : 0.5;
      const aiScore = item.aiScore || 0.5;

      const score =
        rating * w.rating +
        Math.log1p(popularity) * w.popularity +
        recency * w.recency +
        aiScore * w.aiScore;

      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score);
}

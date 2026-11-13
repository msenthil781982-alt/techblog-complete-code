const calculateReadingTime = (htmlContent = '') => {
  if (!htmlContent) return 1;

  const plainText = htmlContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) return 1;

  const wordCount = plainText.split(' ').filter(Boolean).length;
  const wordsPerMinute = 200;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export default calculateReadingTime;

/**
 * Shares content using the native Web Share API when available,
 * falling back to clipboard copy.
 */
export const shareContent = async (title: string, text: string): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: window.location.href });
    } catch (err) {
      console.error('Share failed:', err);
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
  } catch (err) {
    console.error('Clipboard copy failed:', err);
  }
};

/**
 * Returns a greeting string based on the current hour.
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

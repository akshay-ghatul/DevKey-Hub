export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return { success: false, error: 'Failed to copy to clipboard' };
  }
}

export function maskApiKey(key, maskLength = 8) {
  if (!key || key.length <= maskLength) return key;
  return key.substring(0, maskLength) + '*'.repeat(key.length - maskLength);
} 
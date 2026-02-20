/**
 * Fetch wrapper with automatic retry for Render cold starts.
 * When the backend is sleeping, the first request may fail.
 * This utility retries up to 3 times with a delay between attempts.
 */

const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(15000) // 15s timeout per attempt
            });
            return response;
        } catch (error) {
            lastError = error;
            console.warn(`API request attempt ${attempt}/${maxRetries} failed:`, error.message);

            if (attempt < maxRetries) {
                // Wait before retrying (2s, then 4s)
                const delay = attempt * 2000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
};

export default fetchWithRetry;

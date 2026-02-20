/**
 * Fetch wrapper with automatic retry for Render cold starts.
 * When the backend is sleeping, the first request may fail or timeout.
 * This utility retries up to 3 times with exponential backoff.
 */

const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
            console.warn(`API request attempt ${attempt}/${maxRetries} failed:`, error.message);

            // Don't retry if the request was intentionally aborted by the caller
            if (options.signal?.aborted) {
                break;
            }

            if (attempt < maxRetries) {
                // Exponential backoff: 2s, 4s
                const delay = attempt * 2000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // Provide a user-friendly error message
    const friendlyError = new Error(
        'Unable to connect to the server. It may be waking up — please try again in a few seconds.'
    );
    friendlyError.cause = lastError;
    throw friendlyError;
};

export default fetchWithRetry;

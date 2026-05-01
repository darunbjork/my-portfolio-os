# Cache Implementation - Step 3: Create Cache Utility

I have created the `src/utils/cache.js` file, which acts as a singleton for managing the application's caching logic. This utility connects to Redis for caching, with an in-memory fallback for environments where Redis is not available (e.g., during development or testing).

**Key Features of `cache.js`:**
-   **Connection Management:** Establishes and manages a connection to Redis.
-   **In-Memory Fallback:** Automatically switches to an in-memory cache if Redis is unavailable, ensuring the application remains functional.
-   **`get(key)`:** Retrieves data from the cache.
-   **`set(key, value, ttl)`:** Stores data in the cache with an optional time-to-live (TTL).
-   **`del(key)`:** Deletes a specific item from the cache.
-   **`delByPattern(pattern)`:** Deletes multiple items matching a pattern, useful for cache invalidation.
-   **`buildKey(resource, params)`:** Generates standardized cache keys based on resource name and query parameters, allowing for robust caching of lists and single items.

**Changes Made:**
-   Created `src/utils/cache.js` with the complete caching utility logic.
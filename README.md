# Cache Implementation - Step 6: Cache Invalidation (Project)

I have implemented cache invalidation for the create, update, and delete operations related to projects in `src/controllers/projectController.js`. This is a crucial step to ensure that cached data remains fresh and consistent with the database.

**Key Changes:**
-   After a new project is **created** (`createProject`), the cache for all project-related data is invalidated using `await cache.delByPattern('project*')`.
-   Similarly, after a project is **updated** (`updateProject`), the cache for all project-related data is invalidated.
-   Finally, after a project is **deleted** (`deleteProject`), the cache for all project-related data is invalidated.

Using `cache.delByPattern('project*')` ensures that all cached entries related to projects, including lists (with various pagination/sorting parameters) and single items, are cleared. This simple pattern-based deletion prevents serving stale data after modifications.

This step completes the basic caching mechanism for projects, ensuring that both read operations are optimized with caching and write operations correctly invalidate the cache to maintain data integrity.
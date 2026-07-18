/**
 * This migration script fixed the "horn" mod document in MongoDB.
 * The original document used field names that didn't match the Mod schema:
 *   - gameName → game
 *   - authorName → author
 *   - sharemodsLink → shareModsUrl
 *   - downloadsCount → downloadCount
 *   - Missing required fields: slug, status, category, tags, etc.
 *
 * Run via: npx tsx src/seed/fixHornMod.ts
 * Already executed on 2026-07-18. Kept for reference.
 */

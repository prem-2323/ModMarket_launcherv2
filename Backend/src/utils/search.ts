export function buildSearchFilter(query: string, fields: string[]) {
  if (!query || !query.trim()) return {}
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const orConditions = fields.map((field) => ({
    [field]: { $regex: escaped, $options: 'i' },
  }))
  return { $or: orConditions }
}

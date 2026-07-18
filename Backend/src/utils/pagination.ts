export function paginate(page = 1, limit = 20) {
  const p = Math.max(1, page)
  const l = Math.min(100, Math.max(1, limit))
  return { skip: (p - 1) * l, page: p, limit: l }
}

export function paginatedResult<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

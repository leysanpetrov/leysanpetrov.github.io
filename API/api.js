export async function getData (url, query, search) {
  const response = await fetch(`${url}${query}${search}`)
  return await response.json()
}

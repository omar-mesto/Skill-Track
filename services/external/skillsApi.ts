export interface StackTag {
  name: string
  count: number
}

export async function fetchPopularSkills(): Promise<string[]> {
  const response = await fetch(
    'https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow',
  )

  const json = await response.json() as { items: StackTag[] }

  return json.items.map(t => t.name)
}

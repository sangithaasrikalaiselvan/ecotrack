export function sanitizeInput(input: string): string {
  let clean = input.trim()
  clean = clean.replace(/<[^>]*>/g, '')
  if (clean.length > 2000) {
    clean = clean.substring(0, 2000)
  }
  return clean
}

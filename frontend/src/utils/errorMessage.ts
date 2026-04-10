import axios from 'axios'

/** Extracts a readable message from API error responses. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message
  }
  return err instanceof Error ? err.message : String(err)
}

export const staffKeys = {
  all: ['staff'] as const,
  detail: (id: number) => ['staff', id] as const,
}

export const shiftKeys = {
  all: ['shifts'] as const,
  detail: (id: number) => ['shifts', id] as const,
}

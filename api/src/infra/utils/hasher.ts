import md5 from 'md5'

// hash input
export const hash = (value: string): string => md5(value)

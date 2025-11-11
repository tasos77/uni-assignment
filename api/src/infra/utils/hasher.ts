import md5 from 'md5'

export const hash = (value: string): string => md5(value)

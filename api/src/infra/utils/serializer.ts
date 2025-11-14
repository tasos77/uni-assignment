export const serializeFilters = (filters: {
  channels: string
  types: string
  brandTitles: string
  category: string
}): { channels: string[]; types: string[]; brandTitles: string[]; category: string } => {
  const { channels, types, brandTitles, category } = filters
  return {
    channels: channels ? channels.split(',') : [],
    types: types ? types.split(',') : [],
    brandTitles: brandTitles ? brandTitles.split(',') : [],
    category
  }
}

export const serializeFilters = (filters: { channels: string; types: string; brandTitles: string }): { channels: string[]; types: string[]; brandTitles: string[] } => {
  const { channels, types, brandTitles } = filters
  return {
    channels: channels ? channels.split(',') : [],
    types: types ? types.split(',') : [],
    brandTitles: brandTitles ? brandTitles.split(',') : []
  }
}

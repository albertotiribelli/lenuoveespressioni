const IT_LONG_DATE = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const IT_LONG_DATE_WITH_WEEKDAY = new Intl.DateTimeFormat('it-IT', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function parseIsoDateAsUTC(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1))
}

export function formatDateItLong(value: string): string {
  return IT_LONG_DATE.format(parseIsoDateAsUTC(value))
}

export function formatDateItLongWithWeekday(value: string): string {
  return IT_LONG_DATE_WITH_WEEKDAY.format(parseIsoDateAsUTC(value))
}

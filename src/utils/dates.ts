const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface PickupDate {
  iso: string
  label: string
  weekday: string
}

export function getPickupDates(daysAhead = 14): PickupDate[] {
  const dates: PickupDate[] = []
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  for (let offset = 0; offset < daysAhead; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    dates.push({
      iso: toISODate(date),
      label: `${date.getDate()} de ${MONTHS[date.getMonth()]}`,
      weekday: offset === 0 ? 'Hoy' : offset === 1 ? 'Mañana' : WEEKDAYS[date.getDay()],
    })
  }
  return dates
}

export function formatPickupDate(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  return `${WEEKDAYS[date.getDay()]} ${day} de ${MONTHS[date.getMonth()]}`
}

export function formatOrderDate(iso: string): string {
  const date = new Date(iso)
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}, ${time}`
}

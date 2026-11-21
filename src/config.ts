export const BUSINESS = {
  name: 'TCP Maria Vargas',
  legalName: 'TCP Maria Vargas',
  tagline: 'Todo lo que necesitas para tu hogar, en un solo lugar',
  shortDescription:
    'Alimentos, bebidas y productos de aseo seleccionados con cuidado para las familias cubanas. Compra desde tu teléfono y recibe en casa o recoge en el local.',
  address: 'Calle 23 No. 456, entre 6 y 8, Vedado, Plaza de la Revolución, La Habana',
  addressShort: 'Vedado, La Habana',
  phone: '+53 5 467 6775',
  phoneRaw: '5354676775',
  email: 'ventas@tcpmariavargas.cu',
  whatsapp: '5354676775',
  hours: [
    { days: 'Lunes a sábado', time: '8:00 a. m. – 7:00 p. m.' },
    { days: 'Domingos y feriados', time: '8:00 a. m. – 1:00 p. m.' },
  ],
  deliveryNote: 'Entregas a domicilio en La Habana de 1 a 5 horas.',
  pickupNote: 'Listo para recoger en 2 horas dentro del horario del local.',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vedado%2C%20La%20Habana',
} as const

export const CURRENCY = {
  baseCurrency: 'USD' as const,
  cupRate: 940,
  label: {
    USD: 'USD',
    CUP: 'CUP',
  },
}

export const CART_STORAGE_KEY = 'lacosecha.cart.v1'
export const CURRENCY_STORAGE_KEY = 'lacosecha.currency.v1'
export const ORDERS_STORAGE_KEY = 'lacosecha.orders.v1'

export const WHATSAPP_MESSAGE =
  'Hola, estoy interesado en los productos de TCP Maria Vargas.'

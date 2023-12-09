export function notNull(value) {
  if (!value) {
    throw new Error('Todos los campos deben estar completos.')
  }
  return (value)
}
function notNullAndNumber(value) {
  if (!value || typeof value !== 'number' || isNaN(value)) {
    throw new Error('Todos los campos deben estar completos y deben ser caracteres numericos.')
  }
  return (value)
}

export class Product {
  constructor({ id, title, price, description, thumbnail, code, stock, category, status }) {
    this.id = id
    this.title = notNull(title)
    this.description = notNull(description)
    this.price = price
    this.thumbnail = thumbnail
    this.code = notNull(code)
    this.category = notNull(String(category))
    this.stock = stock
    this.status = notNull(Boolean(status))
  }
}
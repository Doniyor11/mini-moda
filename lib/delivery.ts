// Yetkazib berish narxlarini olish uchun utility function
export function getDeliverySettings() {
  if (typeof window === "undefined") {
    return {
      deliveryFee: 15000,
      freeDeliveryLimit: 100000,
      courierFee: 15000,
      expressDeliveryFee: 25000,
    }
  }

  const savedSettings = localStorage.getItem("delivery_settings")
  const defaultSettings = {
    deliveryFee: 15000,
    freeDeliveryLimit: 100000,
    courierFee: 15000,
    expressDeliveryFee: 25000,
  }

  if (savedSettings) {
    const parsed = JSON.parse(savedSettings)
    return {
      deliveryFee: Number.parseInt(parsed.deliveryFee || "15000"),
      freeDeliveryLimit: Number.parseInt(parsed.freeDeliveryLimit || "100000"),
      courierFee: Number.parseInt(parsed.courierFee || "15000"),
      expressDeliveryFee: Number.parseInt(parsed.expressDeliveryFee || "25000"),
    }
  }

  return defaultSettings
}

export function calculateDeliveryFee(totalPrice: number, deliveryMethod = "courier"): number {
  const settings = getDeliverySettings()

  // Agar buyurtma summasi bepul yetkazib berish chegarasidan yuqori bo'lsa
  if (totalPrice >= settings.freeDeliveryLimit) {
    return 0
  }

  // Yetkazib berish usuli bo'yicha narx
  switch (deliveryMethod) {
    case "courier":
      return settings.courierFee
    case "express":
      return settings.expressDeliveryFee
    case "pickup":
      return 0
    default:
      return settings.deliveryFee
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
}

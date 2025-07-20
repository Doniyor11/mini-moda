import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Biz bilan bog'laning</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Savollaringiz bormi? Yordam kerakmi? Biz bilan bog'laning va tez orada javob beramiz!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Xabar yuborish</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Aloqa ma'lumotlari</h2>
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  )
}

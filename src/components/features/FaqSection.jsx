import { useState } from "react"
import { ChevronDown } from "lucide-react"

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[#EAEAEA]">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-[#111111]">{question}</span>
        <ChevronDown 
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="text-muted-foreground font-light leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  )
}

export function FaqSection() {
  const faqs = [
    { question: "Is Toolzio free?", answer: "Yes, our core tools are completely free to use. We will be introducing premium plans for batch processing and API access in the future." },
    { question: "Are my files secure?", answer: "Absolutely. All files are encrypted using 256-bit AES encryption during transfer and rest. We do not inspect or share your data." },
    { question: "How long are files stored?", answer: "Files are automatically and permanently deleted from our servers 2 hours after processing. We do not keep backups of your personal files." },
    { question: "What is the maximum upload size?", answer: "Currently, you can upload files up to 50MB. This limit will be increased for premium users soon." },
    { question: "What formats are supported?", answer: "We support a wide range of formats including PDF, DOCX, PPT, JPG, PNG, and WEBP. We are constantly adding support for more formats." }
  ]

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-[#111111]">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground font-light">
              Everything you need to know about the product and billing.
            </p>
          </div>

          <div className="flex flex-col">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

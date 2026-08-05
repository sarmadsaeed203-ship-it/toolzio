import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function ToolCard({ icon: Icon, title, description, link }) {
  const CardContent = (
    <Card className="group relative overflow-hidden cursor-pointer border-[#EAEAEA] bg-white transition-all duration-300 hover:border-[#111111]/10 hover:shadow-lg hover:-translate-y-1 h-full">
      <CardHeader className="p-8">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-lg font-semibold text-[#111111] mb-2 pr-6">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>

        <div className="absolute right-6 top-8 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
    </Card>
  )

  if (link) {
    return <Link to={link} className="block h-full">{CardContent}</Link>
  }

  return CardContent
}

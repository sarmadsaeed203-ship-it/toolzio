import { ToolCard } from "../shared/ToolCard"
import { 
  FileText, FileType, FileArchive, 
  Crop, Eraser, UserSquare2, FileEdit
} from "lucide-react"

const ALL_TOOLS = [
  { id: "pdf-editor", category: "pdf", title: "⭐ PDF Editor", description: "Edit, merge, split, and organize PDFs online.", icon: FileEdit, link: "/pdf-editor" },
  { id: "pdf-to-word", category: "pdf", title: "PDF to Word", description: "Convert PDF documents to editable Word files.", icon: FileText, link: "/pdf-to-word" },
  { id: "word-to-pdf", category: "document", title: "Word to PDF", description: "Convert Word documents to PDF easily.", icon: FileType, link: "/word-to-pdf" },
  { id: "compress-pdf", category: "pdf", title: "Compress PDF", description: "Reduce file size while optimizing quality.", icon: FileArchive, link: "/compress-pdf" },
  { id: "bg-remover", category: "image", title: "Background Remover", description: "Automatically remove image backgrounds.", icon: Eraser, link: "/background-remover" },
  { id: "passport-photo", category: "image", title: "Passport Photo Maker", description: "Create perfect passport photos in seconds.", icon: UserSquare2, link: "/passport-photo-maker" },
  { id: "image-compress", category: "image", title: "Image Compressor", description: "Compress JPG, PNG, and WebP without losing quality.", icon: FileArchive, link: "/image-compressor" },
  { id: "image-resize", category: "image", title: "Image Resize", description: "Resize images to exact pixel dimensions.", icon: Crop, link: "/image-resizer" },
]

export function ToolsSection({ activeCategory }) {
  const displayedTools = activeCategory === "all" 
    ? ALL_TOOLS 
    : ALL_TOOLS.filter(t => t.category === activeCategory)

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {activeCategory === "all" ? "Most Popular Tools" : `${activeCategory === "pdf" ? "PDF" : activeCategory === "image" ? "Image" : "Document"} Tools`}
          </h2>
          <p className="text-muted-foreground">
            {activeCategory === "all" 
              ? "Everything you need to work with your files in one place." 
              : `Selected tools to help you manage your ${activeCategory} files.`}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayedTools.map((tool) => (
            <ToolCard 
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              link={tool.link}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#EAEAEA]">
      <div className="container px-4 py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg leading-none">T</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#111111]">Toolzio</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed font-light mb-6">
              One workspace for every file. Convert, edit, compress and organize documents and images securely.
            </p>
            <p className="text-sm font-medium text-[#111111]">
              Made for professionals.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-[#111111]">Products</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-light">
              <li><a href="#" className="hover:text-primary transition-colors">PDF Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Image Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Document Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-[#111111]">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-light">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-[#111111]">Connect</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-light">
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#EAEAEA] flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-light">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Toolzio Inc. All rights reserved.</p>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">v1.0.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#111111] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#111111] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

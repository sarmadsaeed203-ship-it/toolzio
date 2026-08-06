import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { AnalyticsProvider } from "./components/AnalyticsProvider"

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })))
const PdfToWord = lazy(() => import("./pages/PdfToWord").then(m => ({ default: m.PdfToWord })))
const WordToPdf = lazy(() => import("./pages/WordToPdf").then(m => ({ default: m.WordToPdf })))
const MergePdf = lazy(() => import("./pages/legacy/MergePdf").then(m => ({ default: m.MergePdf })))
const SplitPdf = lazy(() => import("./pages/legacy/SplitPdf").then(m => ({ default: m.SplitPdf })))
const CompressPdf = lazy(() => import("./pages/CompressPdf").then(m => ({ default: m.CompressPdf })))
const PdfEditor = lazy(() => import('./pages/PdfEditor').then(m => ({ default: m.PdfEditor })))
const ImageStudio = lazy(() => import('./pages/ImageStudio').then(m => ({ default: m.ImageStudio })))

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsProvider>
          <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pdf-to-word" element={<PdfToWord />} />
              <Route path="/word-to-pdf" element={<WordToPdf />} />
              <Route path="/merge-pdf" element={<MergePdf />} />
              <Route path="/split-pdf" element={<SplitPdf />} />
              <Route path="/compress-pdf" element={<CompressPdf />} />
              <Route path="/pdf-editor" element={<PdfEditor />} />
              <Route path="/image-studio" element={<ImageStudio />} />
            </Routes>
          </Suspense>
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App

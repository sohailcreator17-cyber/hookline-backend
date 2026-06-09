import { Sidebar } from "@/components/sidebar"
import { PitchGenerator } from "@/components/pitch-generator"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-12 lg:py-14">
        <PitchGenerator />
      </main>
    </div>
  )
}

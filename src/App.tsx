import { Navbar } from "@/components/layout/nav-bar"
import { WorkspaceManager } from "@/components/flights/workspace-manager"
import { Sidebar } from "./components/layout/sidebar"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0"> {/* Added min-w-0 to prevent flex child from overflowing */}
          <main className="flex-1 w-full px-4 md:container md:max-w-[1200px] md:mx-auto py-6 overflow-x-hidden">
            <WorkspaceManager />
          </main>

          <footer className="border-t py-4">
            <div className="px-4 md:container md:max-w-[1200px] md:mx-auto">
              <p className="text-sm text-center text-muted-foreground">
                Feito com ❤️ para ajudar você a organizar suas viagens
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App

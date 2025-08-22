import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import SearchBar from "@/app/components/search-bar/page"

export function SiteHeader() {
  const items = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
    { label: "Slight", value: "slight" }
  ]

  return (
    <header className="relative z-10 flex flex-col shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="menu-2" />
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex-grow h-full">
          {/* Remove overflow-hidden/auto here */}
          <SearchBar commands={items} />
        </div>
      </div>
    </header>
  )
}

// import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "SpooderDB",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
        </TooltipProvider>
        {/* <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  )
}

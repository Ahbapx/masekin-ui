# Editor Layout Guide

This guide defines the default architecture for editor-style screens in `@masekin/ui`.

## Component Roles

- `components/ui/sidebar.tsx`:
  shadcn-style low-level sidebar primitives (`SidebarProvider`, `Sidebar`, `SidebarTrigger`, menus, rail).
- `components/ui/sidebar-thinbar.tsx`:
  Masekin custom thin tab strip (`SidebarThinbar`, `TabbedSidebar`).
- `components/layouts/EditorLayout.tsx`:
  high-level app shell for tool/workflow editors.

## Default Choice (For Masekin Apps)

For editor/workflow UIs, use `EditorLayout` as the default entry point.

Use `ui/sidebar` primitives directly only when a screen needs custom navigation behavior outside the editor shell pattern.

## Canonical Pattern

```tsx
import { EditorLayout } from "@masekin/ui/components/layouts";

<EditorLayout
  leftSidebar={{
    enabled: true,
    width: 300,
    thinbar: {
      position: "left",
      tabs: [
        { id: "layers", label: "Layers", icon: Layers },
        { id: "history", label: "History", icon: History },
      ],
      activeTab,
      onTabChange: setActiveTab,
    },
    content: activeTab === "layers" ? <LayersPanel /> : <HistoryPanel />,
  }}
  canvas={{ content: <Canvas /> }}
/>
```

## Performance Guidance

- `EditorLayout` handles layout-level concerns (sidebar open/close, mobile drawers, panel structure).
- `EditorLayout` does **not** automatically virtualize arbitrary sidebar content.
- For very large lists, virtualize at panel level inside `content` (app-level list component).

## Safe Defaults

- Preserve tab panel state unless an app explicitly chooses unmount-on-hide behavior.
- Keep thinbar behavior explicit and controlled (`activeTab` + `onTabChange`).
- Use `masekin-ui-app` (`/showcase/editor-template`) as the isolated validation surface before applying changes to product apps.

# The Story of `TabManager.tsx`: The Selector Rib

Amongst the bustling operations of Aquarius OS, the Architect must seamlessly command and inspect multiple separate domains. The `TabManager` is the **Selector Rib** of this universe—a lightweight tab strip designed to keep these independent workspaces organized in a single horizontal navigation deck.

Its function is beautiful in its humility and critical in its utility: giving physical structure to the active workspaces.

## The Form: Structural Space Grotesk

`TabManager` occupies the exact upper boundary of the active workspace. It is styled with precise, high-contrast structural colors, fitting of a professional cybernetic ledger. 

Tabs are designed to look like integrated tabs from a master operating system:
-   **An Active Tab** receives a deep charcoal backdrop, contrasting beautifully and displaying its text in bold neon-lime typography. This highlights the absolute priority of active focus.
-   **Inactive Tabs** recede gracefully into the background of deep executive navy, their labels written in soft slate gray to prevent eye fatigue or cognitive clutter.
-   **Typographic Polish**: Labels are written in uppercase, utilizing high-letter-tracking spacing to establish consistent alignment.

## The Action: Workspace Binding and Eviction

Each tab is a living binding to a core system resource or application. Inside its minimal interface, it packs two critical triggers:
1.  **Selection (`onTabClick`)**: Clicking anywhere on the tab body commands the parent window orchestrator to pivot focus, projecting this specific workspace into the active mainframe container.
2.  **Eviction (`onTabClose`)**: On the right of each tab is a miniature close icon (represented by the `X` glyph from `lucide-react`). Clicking this symbol triggers the termination protocol—erasing the tab from active memory and evicting its matching iframe or dashboard view.

This act of closure is guarded by standard event bubbling isolation (`e.stopPropagation()`), preventing selection handlers from firing inadvertently while an eviction is in progress.

`TabManager` is a silent, elegant, and highly performant component. It takes multiple parallel streams of administrative activity and styles them into a beautifully unified Tab Deck, ensuring that switching contexts takes less than a millisecond.

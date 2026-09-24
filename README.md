# agreed

A SvelteKit contract viewer with clause boxes, document search, a guide, and measured page layout. The app is prerendered for Vercel and has no database.

## Development

Node.js 22.12 or newer is required.

```sh
npm install
npm run dev
```

## Verification

```sh
npm run check
npm run build
```

## Contract content

The Oceans XYZ Professional Services Contract, including the signature page and Exhibit A, is in `src/lib/content/contract/contract-data.ts`. TypeScript checks its document structure at build time. Its numbering is literal text so `(ii)` and similar labels remain unchanged. Clause box definitions are in `src/lib/content/contract/clause-boxes.ts`.

Highlighted ranges are `ClauseNode` wrappers around text; typography remains on `TextNode`s. A replaceable range inside a clause is a `ProvisionNode` with a stable ID. The candidate replacement lives separately in `src/lib/content/contract/concessions.ts`, and a clause box's preferred concession refers to it by ID. `resolveContract` has two explicit views of the same selection: `effective` replaces the original provision with the concession, while `redline` retains the original as grey struck out text and appends the concession in the clause's normal green highlight. The viewer paginates the redline; a future download should use the effective view. Removed text is CSS generated from the redline data, so it is absent from selectable DOM text and document search. Applying and removing a concession changes only in-memory viewer state; refreshing restores the original contract. `validate-contract.ts` checks clause, provision, concession, and clause box references at startup.

A clause box has introductory text and optionally a `negotiation` section. Only a box with `negotiation` can also have `preferredConcessions`, a nonempty list of concession IDs. The two expandable sections are always in the same order. The second heading reads “Preferred concession” for one entry and “Preferred concessions” for more. Each concession defines one `paragraph` of inline text, followed by an inline Apply/Remove control. If several concessions target one provision, selecting another replaces the active choice. `showInfoTooltip` is optional on `preferredConcessions` only, with the message “It’s important to negotiate this clause”. An optional `footerNote` appears at the bottom of the box whether sections are open or closed. Payment Timing and Access and Use are intro-only boxes; Resale has both sections.

The viewer lays out document blocks into pages in the browser, keeping clause identity if text flows across pages. Search scans the displayed pages. The guide opens on the first visit unless the user chooses to hide it; Search and Guide remain available in the document tools. No clause box opens until a user selects a highlighted clause, regardless of whether the guide is shown.

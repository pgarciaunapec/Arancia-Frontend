# Admin Module Implementation (Frontend)

## Scope
Frontend implementation aligned with `Arancia-Backend/docs/ADMIN_MODULE_SPEC.md` for dynamic admin collection management.

## Implemented Features
- Admin collections list page:
  - route: `/admin/collections`
  - open/configure actions.
- Dynamic collection page:
  - route: `/admin/collections/:collection`
  - generated table from `AdminConfig` visible fields,
  - full CRUD,
  - bulk update/delete,
  - import (`csv`/`json`) with mapping,
  - export (`csv`/`json`),
  - file upload through generated forms,
  - audit log viewer modal.
- Form generator (`RecordForm`) from `AdminConfig`:
  - types: string, number, boolean, date, datetime, enum, reference, file/image, array, object,
  - required and validator support,
  - JSON fallback editor.
- Reference autocomplete component (`ReferencePicker`) backed by admin API.
- New hooks:
  - `useAdminConfig(collection)`
  - `useCollectionRecords(collection, options)`
- Admin sidebar navigation entry for collections.

## Files Added/Updated
- `src/pages/admin/AdminCollections.tsx`
- `src/pages/admin/AdminCollectionView.tsx`
- `src/pages/admin/AdminLayout.tsx`
- `src/services/admin.service.ts`
- `src/lib/api.ts`
- `src/hooks/useAdminConfig.ts`
- `src/hooks/useCollectionRecords.ts`
- `src/components/admin/RecordForm.tsx`
- `src/components/admin/ReferencePicker.tsx`
- `src/components/admin/JsonEditorModal.tsx`
- `src/types/admin.ts`

## Testing
### Unit / Component
- `src/components/admin/RecordForm.test.tsx`
- `src/components/admin/ReferencePicker.test.tsx`
- `src/hooks/admin.hooks.test.tsx`

### E2E (Playwright)
- `e2e/admin-module.spec.ts`
  - login
  - collections list
  - create/edit/delete
  - import/export
  - upload
  - audit log check

## Run Locally
```bash
cd Arancia-Frontend
pnpm install
npx vitest run --reporter verbose
npx vitest run --coverage
npx playwright install chromium
npx playwright test
```

## CI Example
```bash
pnpm install --frozen-lockfile
pnpm test
pnpm test:coverage
pnpm test:e2e
```

## Coverage Gate
Coverage configured in `vitest.config.ts` for critical admin frontend components and hooks.

## Notes and Trade-offs
- The current E2E suite uses API route mocking for deterministic flow validation; backend-integrated E2E can be added in CI with docker compose.
- Import mapping UX is JSON text-based in MVP. A visual mapper can be introduced in Phase 2/3.
- JSON fallback remains available for arbitrary structures while preserving generated form UX for common fields.

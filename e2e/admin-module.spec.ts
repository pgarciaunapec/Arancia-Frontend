import { expect, test } from "@playwright/test";

test("admin module full flow: login/list/create/edit/delete/import/export/upload/audit", async ({
  page,
}) => {
  test.setTimeout(120000);

  const state = {
    nextId: 2,
    records: [
      { _id: "1", name: "Pizza Base", price: 15, imageUrl: "" },
    ] as Array<Record<string, unknown>>,
    config: {
      collection: "TestItems",
      fields: [
        {
          name: "name",
          label: "Nombre",
          type: "string",
          required: true,
          editable: true,
          visible: true,
          order: 1,
        },
        {
          name: "price",
          label: "Precio",
          type: "number",
          required: true,
          editable: true,
          visible: true,
          order: 2,
        },
        {
          name: "imageUrl",
          label: "Imagen",
          type: "file",
          editable: true,
          visible: true,
          order: 3,
        },
      ],
    },
    audits: [] as Array<{
      action: string;
      collection: string;
      docId?: string;
      userEmail: string;
      timestamp: string;
      diff?: Record<string, unknown>;
    }>,
  };

  const addAudit = (
    action: string,
    docId?: string,
    diff?: Record<string, unknown>,
  ) => {
    state.audits.unshift({
      action,
      collection: "TestItems",
      docId,
      userEmail: "admin@test.com",
      timestamp: new Date().toISOString(),
      diff,
    });
  };

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    const json = (data: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(data),
      });

    if (path.endsWith("/auth/login") && method === "POST") {
      return json({
        success: true,
        data: {
          token: "e2e-token",
          user: {
            _id: "admin-1",
            name: "Admin",
            email: "admin@test.com",
            role: "admin",
            phone: "0000000000",
            address: "HQ",
          },
        },
      });
    }

    if (path.endsWith("/auth/me") && method === "GET") {
      return json({
        success: true,
        data: {
          _id: "admin-1",
          name: "Admin",
          email: "admin@test.com",
          role: "admin",
          phone: "0000000000",
          address: "HQ",
        },
      });
    }

    if (path.endsWith("/admin/users") && method === "GET") {
      return json({ success: true, data: [] });
    }

    if (path.endsWith("/admin/tables") && method === "GET") {
      return json({ success: true, data: [] });
    }

    if (path.endsWith("/admin/cash-register/today") && method === "GET") {
      return json({ success: true, data: null });
    }

    if (path.endsWith("/admin/inventory") && method === "GET") {
      return json({ success: true, data: [] });
    }

    if (path.endsWith("/admin/inventory/alerts") && method === "GET") {
      return json({ success: true, data: [] });
    }

    if (path.endsWith("/admin/collections") && method === "GET") {
      return json({
        success: true,
        data: [{ name: "TestItems", count: state.records.length }],
      });
    }

    if (
      path.endsWith("/admin/collections/config/TestItems") &&
      method === "GET"
    ) {
      return json({ success: true, data: state.config });
    }

    if (
      path.endsWith("/admin/collections/config/TestItems") &&
      method === "PUT"
    ) {
      const payload = request.postDataJSON() as Record<string, unknown>;
      state.config = { ...state.config, ...payload };
      return json({ success: true, data: state.config });
    }

    if (path.endsWith("/admin/collections/TestItems") && method === "GET") {
      return json({
        success: true,
        data: {
          docs: state.records,
          total: state.records.length,
          page: 1,
          limit: 20,
        },
      });
    }

    if (path.endsWith("/admin/collections/TestItems") && method === "POST") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      const record = { _id: String(state.nextId++), ...payload };
      state.records.unshift(record);
      addAudit("create", String(record._id), { after: record });
      return json({ success: true, data: record }, 201);
    }

    if (
      path.includes("/admin/collections/TestItems/") &&
      method === "PUT" &&
      !path.endsWith("/assets")
    ) {
      const id = path.split("/").pop() as string;
      const payload = request.postDataJSON() as Record<string, unknown>;
      const index = state.records.findIndex((item) => String(item._id) === id);
      if (index === -1) {
        return json({ error: "not found" }, 404);
      }
      const before = state.records[index];
      state.records[index] = { ...state.records[index], ...payload };
      addAudit("update", id, { before, after: state.records[index] });
      return json({ success: true, data: state.records[index] });
    }

    if (path.includes("/admin/collections/TestItems/") && method === "DELETE") {
      const id = path.split("/").pop() as string;
      state.records = state.records.filter((item) => String(item._id) !== id);
      addAudit("delete", id, { before: { _id: id } });
      return json({ success: true, message: "Registro eliminado" });
    }

    if (
      path.endsWith("/admin/collections/TestItems/bulk") &&
      method === "POST"
    ) {
      const payload = request.postDataJSON() as {
        action: "update" | "delete";
        ids: string[];
        payload?: Record<string, unknown>;
      };
      if (payload.action === "delete") {
        state.records = state.records.filter(
          (item) => !payload.ids.includes(String(item._id)),
        );
        addAudit("bulk-delete");
      }
      if (payload.action === "update" && payload.payload) {
        state.records = state.records.map((item) =>
          payload.ids.includes(String(item._id))
            ? { ...item, ...payload.payload }
            : item,
        );
        addAudit("bulk-update");
      }
      return json({ success: true, data: { affected: payload.ids.length } });
    }

    if (
      path.endsWith("/admin/collections/TestItems/import") &&
      method === "POST"
    ) {
      const imported = {
        _id: String(state.nextId++),
        name: "Importado CSV",
        price: 9,
      };
      state.records.unshift(imported);
      addAudit("import", String(imported._id), { after: imported });
      return json({
        success: true,
        data: {
          processed: 1,
          inserted: 1,
          updated: 0,
          skipped: 0,
          errors: [],
        },
      });
    }

    if (
      path.endsWith("/admin/collections/TestItems/export") &&
      method === "GET"
    ) {
      return route.fulfill({
        status: 200,
        contentType: "text/csv",
        headers: {
          "content-disposition": 'attachment; filename="TestItems.csv"',
        },
        body: "name,price\nPizza Base,15\n",
      });
    }

    if (path.endsWith("/assets") && method === "POST") {
      const id = path.split("/").slice(-2)[0];
      const index = state.records.findIndex((item) => String(item._id) === id);
      if (index >= 0) {
        state.records[index] = {
          ...state.records[index],
          imageUrl: "/uploads/admin/e2e.png",
        };
      }
      addAudit("update", id, { after: { imageUrl: "/uploads/admin/e2e.png" } });
      return json({ success: true, data: { path: "/uploads/admin/e2e.png" } });
    }

    if (path.endsWith("/admin/audit") && method === "GET") {
      return json({ success: true, data: state.audits });
    }

    return json({ success: true, data: [] });
  });

  await page.goto("/admin/login");

  await page.getByPlaceholder("admin@restaurante.com").fill("admin@test.com");
  await page.getByPlaceholder("••••••••").fill("secret123");
  await page.getByRole("button", { name: "Ingresar al Panel" }).click();

  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("link", { name: "Colecciones" }).click();
  await expect(page.getByText("Colecciones de BD")).toBeVisible();

  await page.getByRole("button", { name: "Abrir" }).click();
  await expect(page.getByText("Colección: TestItems")).toBeVisible();

  await page.getByRole("button", { name: "Nuevo" }).click();
  await page.getByLabel("Nombre").fill("Pizza Especial");
  await page.getByLabel("Precio").fill("20");
  await page.getByRole("button", { name: "Guardar" }).click();

  await expect(page.getByText(/creado correctamente/i)).toBeVisible();

  await page
    .getByRole("button", { name: /^Editar$/ })
    .first()
    .click();
  await expect(page.getByText("Editar registro")).toBeVisible();
  await page.getByLabel("Precio").fill("22");
  await page.getByLabel("Imagen").setInputFiles({
    name: "sample.png",
    mimeType: "image/png",
    buffer: Buffer.from("image-data"),
  });
  await page.getByRole("button", { name: "Guardar" }).click();

  await expect(page.getByText(/actualizado correctamente/i)).toBeVisible();

  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles({
      name: "import.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("name,price\nImportado,9\n"),
    });
  await page.getByRole("button", { name: "Importar archivo" }).click();
  await expect(page.getByText(/Importación completada/i)).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("TestItems");

  await page.getByRole("checkbox").nth(1).check();
  await page.getByRole("button", { name: "Bulk delete" }).click();
  await expect(page.getByText(/Se eliminaron/i)).toBeVisible();

  await page.getByRole("button", { name: "Ver auditoría" }).click();
  await expect(page.getByText("Audit Log · TestItems")).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "create" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "update" }).first(),
  ).toBeVisible();
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecordForm from "./RecordForm";
import type { AdminConfig } from "../../types/admin";

const config: AdminConfig = {
  collection: "MenuItem",
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
      name: "sku",
      label: "SKU",
      type: "string",
      required: false,
      editable: false,
      visible: true,
      order: 3,
    },
  ],
};

describe("RecordForm", () => {
  it("validates required fields", async () => {
    const onSubmit = vi.fn();
    render(<RecordForm config={config} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    const validationMessages = await screen.findAllByText(/obligatorio/i);
    expect(validationMessages.length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits generated payload from admin config", async () => {
    const onSubmit = vi.fn();
    render(<RecordForm config={config} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Pizza" },
    });
    fireEvent.change(screen.getByLabelText("Precio"), {
      target: { value: "25" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Pizza", price: 25 });
    });
  });

  it("supports json fallback mode", async () => {
    const onSubmit = vi.fn();
    render(<RecordForm config={config} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /fallback json/i }));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: '{"name":"Pasta","price":12}' },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Pasta", price: 12 });
    });
  });

  it("renders multiple field types and submits normalized values", async () => {
    const onSubmit = vi.fn();
    const fullConfig: AdminConfig = {
      collection: "Complex",
      fields: [
        {
          name: "name",
          type: "string",
          required: true,
          visible: true,
          editable: true,
          order: 1,
        },
        {
          name: "status",
          type: "enum",
          enumOptions: ["draft", "published"],
          visible: true,
          editable: true,
          order: 2,
        },
        {
          name: "active",
          type: "boolean",
          visible: true,
          editable: true,
          order: 3,
        },
        {
          name: "startDate",
          type: "date",
          visible: true,
          editable: true,
          order: 4,
        },
        {
          name: "eventAt",
          type: "datetime",
          visible: true,
          editable: true,
          order: 5,
        },
        {
          name: "tags",
          type: "array",
          visible: true,
          editable: true,
          order: 6,
        },
        {
          name: "meta",
          type: "object",
          visible: true,
          editable: true,
          order: 7,
        },
        {
          name: "categoryId",
          type: "reference",
          visible: true,
          editable: true,
          order: 8,
          reference: { collection: "Category", displayField: "name" },
        },
        {
          name: "asset",
          type: "file",
          visible: true,
          editable: true,
          order: 9,
        },
      ],
    };

    render(
      <RecordForm
        config={fullConfig}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        initialData={{ tags: ["a"], meta: { foo: "bar" } }}
      />,
    );

    fireEvent.change(screen.getByLabelText("name"), {
      target: { value: "Evento" },
    });
    fireEvent.change(screen.getByLabelText("status"), {
      target: { value: "published" },
    });
    fireEvent.click(screen.getByLabelText("active"));
    fireEvent.change(screen.getByLabelText("startDate"), {
      target: { value: "2026-04-10" },
    });
    fireEvent.change(screen.getByLabelText("eventAt"), {
      target: { value: "2026-04-10T12:30" },
    });
    fireEvent.change(screen.getByLabelText("tags"), {
      target: { value: '["x","y"]' },
    });
    fireEvent.change(screen.getByLabelText("meta"), {
      target: { value: '{"priority":"high"}' },
    });

    const file = new File(["content"], "doc.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("asset"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const payload = vi.mocked(onSubmit).mock.calls[0][0] as Record<
      string,
      unknown
    >;
    expect(payload.name).toBe("Evento");
    expect(payload.status).toBe("published");
    expect(payload.active).toBe(true);
    expect(payload.startDate).toBe("2026-04-10");
    expect(payload.eventAt).toBe("2026-04-10T12:30");
    expect(payload.tags).toEqual(["x", "y"]);
    expect(payload.meta).toEqual({ priority: "high" });
    expect(payload.asset).toBeInstanceOf(File);
  });

  it("shows json fallback parser errors for invalid json", async () => {
    const onSubmit = vi.fn();
    render(<RecordForm config={config} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /fallback json/i }));
    fireEvent.change(screen.getByLabelText("JSON Fallback"), {
      target: { value: "{invalid}" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(
      await screen.findByText(/JSON inválido|property name/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

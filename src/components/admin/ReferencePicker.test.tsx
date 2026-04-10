import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ReferencePicker from "./ReferencePicker";
import adminService from "../../services/admin.service";

vi.mock("../../services/admin.service", () => ({
  default: {
    listRecords: vi.fn(),
  },
}));

describe("ReferencePicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and selects reference options", async () => {
    const onSelect = vi.fn();
    vi.mocked(adminService.listRecords).mockResolvedValue({
      data: {
        docs: [
          { _id: "1", name: "Pizza" },
          { _id: "2", name: "Pasta" },
        ],
        total: 2,
        page: 1,
        limit: 10,
      },
    } as never);

    render(
      <ReferencePicker
        collection="MenuItem"
        displayField="name"
        onSelect={onSelect}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Buscar en MenuItem"), {
      target: { value: "Pi" },
    });

    await waitFor(() => {
      expect(adminService.listRecords).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    expect(onSelect).toHaveBeenCalledWith("1", { label: "Pizza" });
  });

  it("handles failed lookup gracefully", async () => {
    vi.mocked(adminService.listRecords).mockRejectedValue(new Error("boom"));

    render(
      <ReferencePicker
        collection="MenuItem"
        displayField="name"
        onSelect={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Buscar en MenuItem"), {
      target: { value: "Error" },
    });

    await waitFor(() => {
      expect(adminService.listRecords).toHaveBeenCalled();
    });

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});

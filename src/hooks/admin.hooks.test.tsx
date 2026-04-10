import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import adminService from "../services/admin.service";
import { useAdminConfig } from "./useAdminConfig";
import { useCollectionRecords } from "./useCollectionRecords";

vi.mock("../services/admin.service", () => ({
  default: {
    getConfig: vi.fn(),
    updateConfig: vi.fn(),
    listRecords: vi.fn(),
  },
}));

describe("admin hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and updates admin config", async () => {
    vi.mocked(adminService.getConfig).mockResolvedValue({
      data: {
        collection: "MenuItem",
        fields: [{ name: "name", visible: true }],
      },
    } as never);

    vi.mocked(adminService.updateConfig).mockResolvedValue({
      data: {
        collection: "MenuItem",
        fields: [{ name: "price", visible: true }],
      },
    } as never);

    const { result } = renderHook(() => useAdminConfig("MenuItem"));

    await waitFor(() => {
      expect(result.current.config?.collection).toBe("MenuItem");
    });

    const updated = await result.current.saveConfig({
      fields: [{ name: "price", visible: true }],
    } as never);

    expect(updated?.fields?.[0]?.name).toBe("price");
    expect(adminService.updateConfig).toHaveBeenCalled();
  });

  it("loads paginated collection records", async () => {
    vi.mocked(adminService.listRecords).mockResolvedValue({
      data: {
        docs: [{ _id: "1", name: "Pizza" }],
        total: 1,
        page: 1,
        limit: 20,
      },
    } as never);

    const { result } = renderHook(() => useCollectionRecords("MenuItem"));

    await waitFor(() => {
      expect(result.current.records).toHaveLength(1);
      expect(result.current.pagination.total).toBe(1);
    });

    result.current.setSearch("piz");

    await waitFor(() => {
      expect(adminService.listRecords).toHaveBeenCalledWith(
        "MenuItem",
        expect.objectContaining({ q: "piz" }),
      );
    });

    result.current.setFilter("status", "active");
    result.current.setSort("price:asc");
    result.current.setLimit(50);
    result.current.setPage(2);

    await waitFor(() => {
      expect(adminService.listRecords).toHaveBeenCalledWith(
        "MenuItem",
        expect.objectContaining({
          page: 2,
          limit: 50,
          sort: "price:asc",
          filters: expect.objectContaining({ status: "active" }),
        }),
      );
    });

    result.current.clearFilters();

    await waitFor(() => {
      expect(adminService.listRecords).toHaveBeenCalledWith(
        "MenuItem",
        expect.objectContaining({ q: "", filters: {} }),
      );
    });
  });
});

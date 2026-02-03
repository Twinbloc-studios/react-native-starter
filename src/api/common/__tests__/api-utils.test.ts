import { getNextPageParam, getPreviousPageParam, getUrlParameters, normalizePages } from "../api-utils";

describe("api-utils", () => {
  describe("normalizePages", () => {
    it("flattens paginated results", () => {
      const pages = [
        { results: [{ id: 1 }, { id: 2 }], count: 4, next: null, previous: null },
        { results: [{ id: 3 }, { id: 4 }], count: 4, next: null, previous: null },
      ];

      expect(normalizePages(pages)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });
  });

  describe("getUrlParameters", () => {
    it("returns null for null input", () => {
      expect(getUrlParameters(null)).toBeNull();
    });

    it("parses absolute URLs", () => {
      expect(getUrlParameters("https://api.example.com/items?offset=20&limit=10")).toEqual({
        offset: "20",
        limit: "10",
      });
    });

    it("parses relative query strings", () => {
      expect(getUrlParameters("?cursor=abc&limit=5")).toEqual({
        cursor: "abc",
        limit: "5",
      });
    });

    it("returns empty object when no query is present", () => {
      expect(getUrlParameters("https://api.example.com/items")).toEqual({});
    });
  });

  describe("getNextPageParam", () => {
    it("extracts offset from next URL", () => {
      const page = {
        results: [],
        count: 0,
        next: "https://api.example.com/items?offset=20&limit=10",
        previous: null,
      };

      expect(getNextPageParam(page, [], undefined, [])).toBe(20);
    });

    it("extracts cursor from nested links", () => {
      const page = {
        results: [],
        count: 0,
        next: null,
        previous: null,
        links: {
          next: {
            url: "https://api.example.com/items?cursor=abc123",
          },
        },
      };

      expect(getNextPageParam(page, [], undefined, [])).toBe("abc123");
    });

    it("accepts direct token values", () => {
      const page = {
        results: [],
        count: 0,
        next: "token-42",
        previous: null,
      };

      expect(getNextPageParam(page, [], undefined, [])).toBe("token-42");
    });
  });

  describe("getPreviousPageParam", () => {
    it("extracts page number from previous URL", () => {
      const page = {
        results: [],
        count: 0,
        next: null,
        previous: "https://api.example.com/items?page=2",
      };

      expect(getPreviousPageParam(page, [], undefined, [])).toBe(2);
    });

    it("extracts value from nested pagination object", () => {
      const page = {
        results: [],
        count: 0,
        next: null,
        previous: null,
        pagination: {
          prev_cursor: "prev-abc",
        },
      };

      expect(getPreviousPageParam(page, [], undefined, [])).toBe("prev-abc");
    });

    it("accepts secondary previous keys", () => {
      const page = {
        results: [],
        count: 0,
        next: null,
        previous: null,
        prevPage: 5,
      };

      expect(getPreviousPageParam(page, [], undefined, [])).toBe(5);
    });
  });
});

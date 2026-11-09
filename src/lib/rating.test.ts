import { describe, expect, it } from "vitest"
import { bayesianRating } from "./rating"

describe("bayesianRating", () => {
    it("returns the seed when there are no reviews", () => {
        expect(bayesianRating(4, 0, 0)).toBe(4)
    })

    it("pulls toward a single review without jumping to it", () => {
        expect(bayesianRating(4, 1, 1)).toBe(3.25)
    })

    it("approaches the plain average as reviews grow", () => {
        expect(bayesianRating(5, 100, 30)).toBeCloseTo(3.48, 2)
    })
})

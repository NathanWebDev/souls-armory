export const SEED_WEIGHT = 3

export const bayesianRating = (seed: number, ratingSum: number, count: number) =>
    (seed * SEED_WEIGHT + ratingSum) / (SEED_WEIGHT + count)

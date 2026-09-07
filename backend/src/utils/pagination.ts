export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export type paginationMetadata = {
    page: number,
    offset: number,
    limit: number
};

export const getPagination = (query: any) => {
    // by deafuly page is 1;
    const page = Math.max(Number(query.page) || 1, 1);

    let limit = Number(query.limit) || DEFAULT_LIMIT;

    limit = Math.min(Math.max(limit, 1), MAX_LIMIT);

    // jiske baad se you have to start fetching ig
    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset,
    };
};
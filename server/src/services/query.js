const DEFAULT_LIMIT = 0; // This will return all the documents in the DB
const DEFAULT_PAGE_NUMBER = 1;

const getPagination = (query) => {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_LIMIT;

    return {
        limit,
        skip: limit * (page - 1),
    };
};

module.exports = {
    getPagination
};

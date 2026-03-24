export const buildExpenseFilters = (userId, query = {}) => {
  const { category, type, dateFrom, dateTo, search } = query;
  const filters = { user: userId };

  if (category) {
    filters.category = category;
  }

  if (type) {
    filters.type = type;
  }

  if (dateFrom || dateTo) {
    filters.date = {};
    if (dateFrom) {
      filters.date.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      filters.date.$lte = new Date(dateTo);
    }
  }

  if (search) {
    const expression = new RegExp(search, "i");
    filters.$or = [
      { title: expression },
      { category: expression },
      { merchant: expression },
      { notes: expression },
      { paymentMethod: expression },
    ];
  }

  return filters;
};

export const getSortOption = (sort) => {
  switch (sort) {
    case "date_asc":
      return { date: 1 };
    case "amount_desc":
      return { amount: -1 };
    case "amount_asc":
      return { amount: 1 };
    case "date_desc":
    default:
      return { date: -1, createdAt: -1 };
  }
};

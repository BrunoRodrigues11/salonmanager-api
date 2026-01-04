const toCamel = (o) => {
   if (o instanceof Date) return o;
  if (!o || typeof o !== "object") return o;
  if (Array.isArray(o)) return o.map(toCamel);

  return Object.keys(o).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    acc[camelKey] = toCamel(o[key]);
    return acc;
  }, {});
};

module.exports = toCamel;

const generateQueryString = (params: Record<string, any>): string => {
   const filtered = Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
   );

   if (filtered.length === 0) return "";

   const queryString = filtered
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

   return `?${queryString}`;
}

export { generateQueryString };
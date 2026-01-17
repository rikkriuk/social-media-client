const formatDateWithMonth =(
   isoDate: string,
   t: (key: string) => string,
) => {
   const date = new Date(isoDate);

   // const day = date.getUTCDate();
   const month = t(`months.${getEnglishMonth(isoDate).toLowerCase()}`);
   const year = date.getUTCFullYear();

   return `${month} ${year}`;
}

const getEnglishMonth = (isoDate: string) => {
   return new Date(isoDate).toLocaleString("en-US", {
      month: "long",
   });
};

export { formatDateWithMonth };
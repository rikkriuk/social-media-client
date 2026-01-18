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

const formatRelativeTime = (
   isoDate: string,
   t: (key: string) => string,
): string => {
   const date = new Date(isoDate);
   const now = new Date();
   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

   if (diffInSeconds < 60) {
      return t("justNow");
   }

   const diffInMinutes = Math.floor(diffInSeconds / 60);
   if (diffInMinutes < 60) {
      return `${diffInMinutes} ${t("minutesAgo")}`;
   }

   const diffInHours = Math.floor(diffInMinutes / 60);
   if (diffInHours < 24) {
      return `${diffInHours} ${t("hoursAgo")}`;
   }

   const diffInDays = Math.floor(diffInHours / 24);
   if (diffInDays < 7) {
      return `${diffInDays} ${t("daysAgo")}`;
   }

   const diffInWeeks = Math.floor(diffInDays / 7);
   if (diffInWeeks < 4) {
      return `${diffInWeeks} ${t("weeksAgo")}`;
   }

   const diffInMonths = Math.floor(diffInDays / 30);
   if (diffInMonths < 12) {
      return `${diffInMonths} ${t("monthsAgo")}`;
   }

   const diffInYears = Math.floor(diffInDays / 365);
   return `${diffInYears} ${t("yearsAgo")}`;
};

export { formatDateWithMonth, formatRelativeTime };
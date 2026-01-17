import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* <header className="absolute left-0 right-0 top-4 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
            <span className="text-white text-lg">N</span>
          </div>
          <span className="hidden sm:inline text-gray-700 dark:text-gray-200 font-semibold">Ngahiji</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header> */}

      <div className="px-4 py-6">
        {children}
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 sm:p-20 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <header className="w-full max-w-4xl flex flex-col items-center text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100">
          Expense Tracker
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Track your expenses, manage your budget, and save more effortlessly.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/auth/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Sign Up
          </Link>
          <Link href="/auth/login" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition">
            Log In
          </Link>
        </div>
      </header>

      {/* Features Section */}
      {/* <main className="w-full max-w-4xl flex flex-col gap-16">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Seamless Expense Tracking
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Easily add, edit, and categorize your expenses. Attach receipts and get insights on your spending habits.
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/expense-tracker-illustration.svg"
              alt="Expense Tracker Illustration"
              width={400}
              height={300}
              priority
            />
          </div>
        </section>
        <section className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1 order-2 sm:order-1">
            <Image
              src="/analytics-illustration.svg"
              alt="Analytics Illustration"
              width={400}
              height={300}
              priority
            />
          </div>
          <div className="flex-1 order-1 sm:order-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Powerful Analytics
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              View monthly and yearly summaries, pie charts, and line graphs to visualize your financial data.
            </p>
          </div>
        </section>
      </main> */}

      {/* Footer */}
      {/* <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mt-16 text-sm text-gray-500 dark:text-gray-400">
        <div>&copy; {new Date().getFullYear()} Expense Tracker</div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer> */}
    </div>
  );
}

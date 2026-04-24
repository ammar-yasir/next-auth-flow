import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Welcome to your SaaS application
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/auth/signin" });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {session.user.name || "User"}
              </h2>
              <p className="text-gray-600 text-lg">{session.user.email}</p>
              <p className="text-gray-500 text-sm mt-2">
                User ID: {session.user.id}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Name</p>
                <p className="text-gray-900 text-lg font-semibold mt-1">
                  {session.user.name || "Not provided"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Email</p>
                <p className="text-gray-900 text-lg font-semibold mt-1 break-all">
                  {session.user.email}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">User ID</p>
                <p className="text-gray-900 text-lg font-semibold mt-1 break-all">
                  {session.user.id}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Status</p>
                <p className="text-green-600 text-lg font-semibold mt-1">
                  ✓ Verified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              Your account is secured with OAuth 2.0 authentication through
              trusted providers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Data Protection
            </h3>
            <p className="text-gray-600">
              Your data is encrypted and protected according to modern security
              standards.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast & Reliable
            </h3>
            <p className="text-gray-600">
              Built with Next.js for optimal performance and reliability at
              scale.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-left">
              Update Profile
            </button>
            <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-left">
              View Settings
            </button>
            <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-left">
              Manage Accounts
            </button>
            <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-left">
              View Documentation
            </button>
          </div>
        </div>

        {/* Session Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Session Details
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm overflow-auto max-h-64">
            <pre>
              {JSON.stringify(
                {
                  user: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image ? "[Image present]" : null,
                  },
                  authenticated: true,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
            <p>&copy; 2024 Your SaaS App. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="/terms" className="hover:text-gray-900">
                Terms
              </a>
              <a href="/support" className="hover:text-gray-900">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

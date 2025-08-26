import { AppHero } from '@/components/app-hero'

const features = [
  { title: 'Create Journal Entries', description: 'Easily create and store your thoughts securely on the Solana blockchain.' },
  { title: 'Update Your Entries', description: 'Update and manage your journal entries anytime with just a few clicks.' },
  { title: 'Secure on Solana', description: 'Your entries are safely stored on the Solana blockchain, ensuring privacy and security.' },
]

export function DashboardFeature() {
  return (
    <div className=" text-white">
      {/* Hero Section */}
      <div className="relative b text-white py-20 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Welcome to Your Web3 Journal
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl opacity-80">
            Your thoughts, securely stored and easily managed on the Solana blockchain.
          </p>
          <div className="mt-8">
            <a href="#get-started" className="bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-full text-lg font-semibold">
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-100">App Features</h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="border border-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow ">
              <h3 className="text-xl font-semibold text-gray-100">{feature.title}</h3>
              <p className="mt-4 text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="" id="get-started">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-100">How It Works</h2>
          <div className="mt-8 text-lg text-gray-300">
            <p className="mb-4">Getting started with your journal is easy! Just follow these steps:</p>
            <ol className="space-y-4 list-decimal list-inside text-left mx-auto">
              <li>1. Connect your Solana wallet to the app.</li>
              <li>2. Create your first journal entry by adding a title and message.</li>
              <li>3. Update or delete your entries anytime you wish.</li>
              <li>4. Your entries are safely stored on the Solana blockchain, giving you full control and security.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold">Ready to start journaling on Web3?</h2>
        <p className="mt-4 text-lg sm:text-xl opacity-80">
          Join the Web3 revolution and take control of your journal today.
        </p>
        <div className="mt-8">
          <a href="#get-started" className="bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-full text-lg font-semibold">
            Get Started
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className=" text-white py-8 ">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Web3 Journal. All rights reserved.
          </p>
          <div className="mt-4 text-sm">
            <a href="#" className="hover:text-gray-400 mx-2">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 mx-2">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 mx-2">Contact</a>
          </div>
        </div>
      </div>
    </div>
  )
}

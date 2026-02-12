export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to Tailer</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          The transparent betting platform where every bet is verified and immutable
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3">🔒 Immutable Bets</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Bets cannot be edited or deleted once submitted. Complete transparency guaranteed.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3">🤖 AI Verification</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Every bet is verified by AI to ensure timestamps and results are accurate.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3">📊 Public Stats</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View win %, ROI, profit, and streaks for free. Subscribe for picks before kickoff.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Post Your Bet</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Submit your bet slip before the game starts. Our AI verifies the timestamp to ensure it's submitted before kickoff.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Bet Gets Verified</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI checks the timestamp and validates your bet details. Once verified, the bet becomes immutable - no edits or deletes allowed.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Results & Stats Update</h3>
              <p className="text-gray-600 dark:text-gray-300">
                After the game, results are recorded and your public stats (win %, ROI, profit, streaks) are automatically updated.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Build Your Following</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set your subscription price and let followers subscribe to see your picks before kickoff. Platform takes a percentage via Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Join Tailer today and build your transparent betting record
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold">
          Get Started
        </button>
      </section>
    </main>
  )
}

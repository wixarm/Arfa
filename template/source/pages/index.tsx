import logo from "../assets/img/logo.png";

export default function Home() {
  return (
    <div>
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600 blur-[100px]"></div>
        <div class="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-600 blur-[120px]"></div>
      </div>

      <div class="relative z-10 max-w-2xl w-full backdrop-blur-sm bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden p-10 text-center">
        <div class="flex justify-center mb-8">
          <img
            class="w-40 h-auto select-none drop-shadow-[0_0_20px_rgba(109,40,217,0.5)] hover:drop-shadow-[0_0_25px_rgba(109,40,217,0.7)] transition-all duration-300"
            src={logo}
            alt="Arfa JS Logo"
          />
        </div>

        <h1 class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4 tracking-tight">
          Welcome to <span class="font-black">Arfa JS</span>
        </h1>

        <p class="text-sm text-gray-400 mb-8 max-w-lg mx-auto">
          A lightning-fast, reactive framework for building modern web
          applications.
        </p>

        <div class="flex flex-wrap justify-center gap-4 mb-10">
          <a
            href="/dashboard"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            Dashboard →
          </a>
          <a
            href="/examples"
            class="px-6 py-3 border border-gray-700 hover:bg-gray-800/50 text-gray-300 font-medium rounded-lg transition-all duration-300"
          >
            Explore Examples
          </a>
        </div>

        <div class="inline-flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-full px-4 py-2 text-sm font-mono">
          <span class="text-green-400">$</span>
          <span class="text-gray-300">npx create-arfa</span>
        </div>
      </div>

      <div class="relative z-10 mt-12 text-center text-gray-500 text-sm">
        <p>Built for the future. Powered by reactivity.</p>
        <p>Arman tarhani</p>
      </div>
    </div>
  );
}

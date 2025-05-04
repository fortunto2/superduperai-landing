export default {
  buildCommand: "pnpm run deploy",
  installCommand: "pnpm install",
  outputDirectory: ".open-next",
  cloudflare: {
    workers: {
      enableUnsafeEval: true,
    }
  }
}; 
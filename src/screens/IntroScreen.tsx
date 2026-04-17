import { motion } from 'framer-motion'

export function IntroScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-wrap-plum via-wrap-coral to-wrap-sun text-black px-8 pt-16">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <div className="text-6xl font-display font-bold leading-none tracking-tight">
          Impostos
          <br />
          Wrapped
        </div>
        <div className="mt-3 text-xl font-display font-semibold">2024 · Catalunya</div>
        <div className="mt-10 text-base max-w-xs mx-auto font-medium">
          On han anat els teus impostos aquest any?
          <br />
          <span className="opacity-70">T'ho expliquem en 60 segons.</span>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-0 right-0 text-center text-sm font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Toca per començar →
      </motion.div>
    </div>
  )
}

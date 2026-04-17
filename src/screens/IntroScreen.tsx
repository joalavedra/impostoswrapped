import { motion } from 'framer-motion'
import { ScreenBg } from '../components/ScreenBg'

export function IntroScreen() {
  return (
    <ScreenBg variant="cream-waves">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="m-auto text-center"
      >
        <div className="font-display text-5xl font-bold leading-[0.9] tracking-tight">
          Impostos
          <br />
          Wrapped
        </div>
        <div className="mt-3 text-lg font-display font-semibold">2024 · Catalunya</div>
        <div className="mx-auto mt-8 max-w-[16rem] text-sm font-medium leading-snug">
          On han anat els teus impostos aquest any?
          <br />
          <span className="opacity-60">T'ho expliquem en 60 segons.</span>
        </div>
      </motion.div>
      <motion.div
        className="text-center text-xs font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Toca per començar →
      </motion.div>
    </ScreenBg>
  )
}

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
        <div className="mt-3 text-lg font-display font-semibold">2025 · Catalunya</div>
        <div className="mx-auto mt-8 max-w-[16rem] text-sm font-medium leading-snug">
          On s'han esfumat els teus impostos enguany?
          <br />
          <span className="opacity-60">Deixa'ns un minut i t'ho expliquem.</span>
        </div>
      </motion.div>
      <motion.div
        className="text-center text-xs font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Toca aquí i anem fent →
      </motion.div>
    </ScreenBg>
  )
}

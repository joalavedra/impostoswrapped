import { useCallback, useEffect, useMemo, useState } from 'react'
import { PhoneFrame } from './components/PhoneFrame'
import { StoryProgress } from './components/StoryProgress'
import { SwipeContainer } from './components/SwipeContainer'
import { WrappedProvider, useWrapped } from './state/WrappedContext'
import { IntroScreen } from './screens/IntroScreen'
import { InputScreen } from './screens/InputScreen'
import { ContributionScreen } from './screens/ContributionScreen'
import { PositionScreen } from './screens/PositionScreen'
import { EverydayScreen } from './screens/EverydayScreen'
import { DepartmentsScreen } from './screens/DepartmentsScreen'
import { CategoryScreen } from './screens/CategoryScreen'
import { InterestScreen } from './screens/InterestScreen'
import { RevenueVsSpendScreen } from './screens/RevenueVsSpendScreen'
import { DeficitScreen } from './screens/DeficitScreen'
import { FunnyFactsScreen } from './screens/FunnyFactsScreen'
import { RecapScreen } from './screens/RecapScreen'
import spending from './data/spending.json'

function Wrapped() {
  const { breakdown } = useWrapped()
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const screens = useMemo(() => {
    if (!breakdown) {
      return [{ key: 'intro', node: <IntroScreen /> }, { key: 'input', node: <InputScreen /> }]
    }
    const categoryScreens = spending.categories.map((c, i) => ({
      key: `cat-${c.key}`,
      node: <CategoryScreen category={c} rank={i + 1} />,
    }))
    return [
      { key: 'intro', node: <IntroScreen /> },
      { key: 'input', node: <InputScreen /> },
      { key: 'contribution', node: <ContributionScreen /> },
      { key: 'position', node: <PositionScreen /> },
      { key: 'everyday', node: <EverydayScreen /> },
      { key: 'departments', node: <DepartmentsScreen /> },
      ...categoryScreens,
      { key: 'interest', node: <InterestScreen /> },
      { key: 'revspend', node: <RevenueVsSpendScreen /> },
      { key: 'deficit', node: <DeficitScreen /> },
      { key: 'funny-facts', node: <FunnyFactsScreen /> },
      { key: 'recap', node: <RecapScreen /> },
    ]
  }, [breakdown])

  const total = screens.length
  const clampedIndex = Math.min(index, total - 1)

  useEffect(() => {
    if (breakdown && index <= 1) {
      setProgress(0)
      setIndex(2)
    }
  }, [breakdown, index])

  useEffect(() => {
    if (!breakdown) {
      setProgress(0)
      setIndex(0)
    }
  }, [breakdown])

  const goNext = useCallback(() => {
    setProgress(0)
    setIndex((i) => Math.min(i + 1, total - 1))
  }, [total])
  const goPrev = useCallback(() => {
    setProgress(0)
    setIndex((i) => Math.max(0, i - 1))
  }, [])
  const jump = useCallback((i: number) => {
    setProgress(0)
    setIndex(i)
  }, [])

  const current = screens[clampedIndex]
  const isInput = current.key === 'input' || current.key === 'intro'
  const isRecap = current.key === 'recap'
  const autoAdvanceMs = isInput || isRecap ? undefined : 6500

  return (
    <>
      <StoryProgress total={total} index={clampedIndex} progress={progress} onJump={jump} />
      <SwipeContainer
        index={clampedIndex}
        count={total}
        onPrev={goPrev}
        onNext={goNext}
        autoAdvanceMs={autoAdvanceMs}
        paused={current.key === 'input'}
        onProgress={setProgress}
      >
        {current.node}
      </SwipeContainer>
    </>
  )
}

export default function App() {
  return (
    <WrappedProvider>
      <PhoneFrame>
        <Wrapped />
      </PhoneFrame>
    </WrappedProvider>
  )
}

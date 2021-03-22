type Survivors = {
  crewmates: number;
  imposters: number;
}
type WinOrLose = 'win' | 'lose' | 'unidentified'
type Situation = {
  survivors: Survivors;
  weight: number,
  winOrLose: WinOrLose;
}
const identifyWinOrLose = (survivors: Survivors): WinOrLose => {
  if (survivors.imposters === 0) {
    return 'win'
  } else if (survivors.imposters >= survivors.crewmates) {
    return 'lose'
  }
  return 'unidentified'
}
const ejectEitherSuvivorRecursively = (situation: Situation): Situation[] => {
  let result: Situation[] = [situation]
  if (situation.winOrLose !== 'unidentified') {
    return result
  }
  const newSituationCandidates: Situation[] = [
    {
      survivors: {
        ...situation.survivors,
        crewmates: situation.survivors.crewmates - 1,
      },
      weight: situation.weight * situation.survivors.crewmates / (situation.survivors.crewmates + situation.survivors.imposters),
      winOrLose: 'unidentified',
    },
    {
      survivors: {
        ...situation.survivors,
        imposters: situation.survivors.imposters - 1,
      },
      weight: situation.weight * situation.survivors.imposters / (situation.survivors.crewmates + situation.survivors.imposters),
      winOrLose: 'unidentified',
    },
  ]
  for (const newSituationCandidate of newSituationCandidates) {
    const newSituation: Situation = {
      ...newSituationCandidate,
      winOrLose: identifyWinOrLose(newSituationCandidate.survivors),
    }
    result = [...result, ...ejectEitherSuvivorRecursively(newSituation)]
  }
  return result
}
const calculateWinRate = (crewmates: number, imposters: number): {
  winRate: number,
  loseRate: number,
} => {
  const startedSurvivors: Survivors = {
    crewmates,
    imposters,
  }
  const situations: Situation[] = ejectEitherSuvivorRecursively({
    survivors: startedSurvivors,
    weight: 1,
    winOrLose: identifyWinOrLose(startedSurvivors),
  })
  const winRate = situations.filter(e => e.winOrLose === 'win').reduce((acc, e) => acc + e.weight, 0)
  const loseRate = situations.filter(e => e.winOrLose === 'lose').reduce((acc, e) => acc + e.weight, 0)
  return {
    winRate,
    loseRate,
  }
}
const main = (): void => {
  const args: {
    crewmates: number;
    imposters: number;
  }[] = [
    {crewmates: 7, imposters: 3},
    {crewmates: 6, imposters: 3},
    {crewmates: 5, imposters: 3},
    {crewmates: 4, imposters: 3},
    {crewmates: 3, imposters: 3},
    {crewmates: 8, imposters: 2},
    {crewmates: 7, imposters: 2},
    {crewmates: 6, imposters: 2},
    {crewmates: 5, imposters: 2},
    {crewmates: 4, imposters: 2},
    {crewmates: 3, imposters: 2},
    {crewmates: 2, imposters: 2},
    {crewmates: 7, imposters: 1},
    {crewmates: 6, imposters: 1},
    {crewmates: 5, imposters: 1},
    {crewmates: 4, imposters: 1},
    {crewmates: 3, imposters: 1},
    {crewmates: 2, imposters: 1},
    {crewmates: 1, imposters: 1},
  ]
  const lines: string[] = []
  for (const {crewmates, imposters} of args) {
    const result = calculateWinRate(crewmates, imposters)
    lines.push(
      `crewmates: ${crewmates}, imposters: ${imposters} => winRate: ${result.winRate.toFixed(4)}` +
      ` (checksum: ${result.winRate + result.loseRate})`
    )
  }
  process.stdout.write(lines.join('\n') + '\n')
}
main()
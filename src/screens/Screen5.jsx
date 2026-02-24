import QuestionScreen from './QuestionScreen'

export default function Screen5({ onNext }) {
  return (
    <QuestionScreen
      questionNum={3}
      total={6}
      formKey="question3"
      onNext={onNext}
      questionText='I am <span class="highlight">NOT</span> an <em>unlawful user or addicted to</em> <span class="highlight">ANY</span> <em>controlled substance.</em>'
    />
  )
}

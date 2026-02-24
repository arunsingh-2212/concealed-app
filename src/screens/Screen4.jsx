import QuestionScreen from './QuestionScreen'

export default function Screen4({ onNext }) {
  return (
    <QuestionScreen
      questionNum={2}
      total={6}
      formKey="question2"
      onNext={onNext}
      questionText='I have <span class="highlight">NEVER</span> been convicted of a felony in <span class="highlight">ANY</span> state.'
    />
  )
}

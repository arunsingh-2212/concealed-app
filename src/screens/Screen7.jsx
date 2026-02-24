import QuestionScreen from './QuestionScreen'

export default function Screen7({ onNext }) {
  return (
    <QuestionScreen
      questionNum={5}
      total={6}
      formKey="question5"
      onNext={onNext}
      questionText='I have <span class="highlight">NEVER</span> been convicted by <span class="highlight">ANY</span> court for domestic violence.'
    />
  )
}

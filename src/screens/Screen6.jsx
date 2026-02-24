import QuestionScreen from './QuestionScreen'

export default function Screen6({ onNext }) {
  return (
    <QuestionScreen
      questionNum={4}
      total={6}
      formKey="question4"
      onNext={onNext}
      questionText='I have <span class="highlight">NEVER</span> been adjudicated as mental defective or committed to an institution by <span class="highlight">ANY</span> court.'
    />
  )
}

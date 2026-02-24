import QuestionScreen from './QuestionScreen'

export default function Screen3({ onNext }) {
  return (
    <QuestionScreen
      questionNum={1}
      total={6}
      formKey="question1"
      onNext={onNext}
      questionText='I have <span class="highlight">NEVER</span> had a permit to carry <span class="highlight">denied</span> in <span class="highlight">ANY</span> state.'
    />
  )
}

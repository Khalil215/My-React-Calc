
export default function Digits({ digit, dispatch }) {
  return (
    <button onClick={() => dispatch({ type: 'ADD_DIGIT', num: digit })}>{digit}</button>
  )
}

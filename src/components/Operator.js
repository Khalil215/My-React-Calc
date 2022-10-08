export default function Operator({ operator, dispatch }) {
  return (
    <button onClick={() => dispatch({ type: 'ADD_OPERATOR', sign: operator })}>{operator}</button>
  )
}

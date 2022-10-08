import { useReducer } from "react";
import Digits from "./components/Digits";
import Operator from "./components/Operator"
function App() {


  const initialState = {
    calculation: '0',
    operator: null,
    hiddenCal: null,
    overwrite: false,//overwrite old digits and adding new digits after a computation. if false first new digit can be added
    equal: false,//allows continued calculation with computed digit
    change: false //switch btw operators and determine the state digits can get deleted. set false by adding digit and true by adding operator
  }


  const [{ calculation, operator, hiddenCal, overwrite, equal }, dispatch] = useReducer(calcReducer, initialState)

  function calcReducer(state, action) {


    switch (action.type) {

      case 'ADD_DIGIT':
        //prevent multiple 0 at the start
        if (state.calculation === '0') {
          return { ...state, calculation: `${action.num}` }
        }
        //prevent more than one dot in the operation
        if (state.calculation.includes('.') && action.num == '.') {
          return state
        }
        // show the (first)other number to be calculated with after using an operator
        if (state.hiddenCal && state.overwrite == false) {
          return { ...state, calculation: action.num, overwrite: true, change: false }
        }

        // show the other number to be calculated with after using an operator. used overwrite to allow more digits to be added
        if (state.hiddenCal && state.overwrite) {
          return { ...state, calculation: `${state.calculation}${action.num}` }
        }

        if (state.equal == true) {
          return { ...state, calculation: action.num, equal: false }
        }

        //add digits to calculation
        return { ...state, calculation: `${state.calculation}${action.num}` };


      case 'ADD_OPERATOR':

        //show computed data if computation is going to carry on (Equals to not used)
        if (state.operator !== null && state.hiddenCal !== null && state.change == false) {
          return { ...state, calculation: evaluate(state), hiddenCal: evaluate(state), operator: action.sign, overwrite: false, change: true }
        }
        //continue calculation with computed data (with Equals to)
        if (state.equal == true) {
          return { ...state, hiddenCal: state.calculation, operator: action.sign, overwrite: false }
        }
        // change operation
        if (state.change == true) {
          return { ...state, operator: action.sign }
        }

        return { ...state, operator: action.sign, hiddenCal: state.calculation, overwrite: false, change: true }


      case 'CLEAR':
        return initialState;


      case 'DELETE':
        if (state.change == false) {
          return { ...state, calculation: state.calculation.slice(0, -1) }
        }
        return state

      case 'EVALUATE':
        if(state.calculation =='0' || state.hiddenCal==null||state.operator==null){
          return state
        }
        return { ...state, calculation: evaluate(state), hiddenCal: null, operator: null, equal: true, change: false }
    }
  }


  function evaluate({ calculation, operator, hiddenCal }) {
    const num1 = parseFloat(hiddenCal)
    const num2 = parseFloat(calculation)

    let computation = null
    switch (operator) {
      case '+':
        computation = num1 + num2
        break;
      case '/':
        computation = num1 / num2
        break;
      case '*':
        computation = num1 * num2
        break;
      case '-':
        computation = num1 - num2
        break;

      default:
        break;
    }

    if (computation == 'Infinity') {
      return <>&#8734;</>
    }
    return computation.toString()
  }


  return (
    <div className="calculator">
      <div className="header"><span>{hiddenCal}{operator}</span>{calculation}</div>
      <div className="body">
        <button className="ac" onClick={() => dispatch({ type: 'CLEAR' })}>AC</button>
        <button className="del" onClick={() => dispatch({ type: 'DELETE' })}>DEL</button>
        <Operator operator={'+'} dispatch={dispatch} />
        <Digits digit={'7'} dispatch={dispatch} />
        <Digits digit={'8'} dispatch={dispatch} />
        <Digits digit={'9'} dispatch={dispatch} />
        <Operator operator={'/'} dispatch={dispatch} />
        <Digits digit={'4'} dispatch={dispatch} />
        <Digits digit={'5'} dispatch={dispatch} />
        <Digits digit={'6'} dispatch={dispatch} />
        <Operator operator={'*'} dispatch={dispatch} />
        <Digits digit={'1'} dispatch={dispatch} />
        <Digits digit={'2'} dispatch={dispatch} />
        <Digits digit={'3'} dispatch={dispatch} />
        <Operator operator={'-'} dispatch={dispatch} />
        <Digits digit={'.'} dispatch={dispatch} />
        <Digits digit={'0'} dispatch={dispatch} />


        <button className="equal" onClick={() => dispatch({ type: 'EVALUATE' })}>=</button>
      </div>
    </div>
  );
}

export default App;

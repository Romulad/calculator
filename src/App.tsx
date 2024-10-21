import { useEffect, useRef, useState } from "react";


function App() {
  const [currentOperation, setCurrentOperation] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<Array<string>>>([]);
  const [error, setError] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const historyBtnRef = useRef<HTMLButtonElement>(null);

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];
  const operators = [
    {
      symbole: "/",
      name: "divide"
    },
    {
      symbole: "x",
      name: "multi"
    },
    {
      symbole: "-",
      name: "minus"
    },
    {
      symbole: "+",
      name: "add"
    }
  ]

  useEffect(()=>{
    document.addEventListener('click', (ev: any)=>{
      if(!historyBtnRef.current?.contains(ev.target)){
        setShowHistory(false);
      }
    })
  }, [])

  function getOperationWithoutLastAdded(){
    return currentOperation.slice(0, currentOperation.length - 1)
  }

  function toEvaluate(operation?: string[]){
    return operation ? operation.join('').replaceAll('x', "*") : currentOperation.join('').replaceAll('x', "*")
  }

  function toggleShowHistory(){
    setShowHistory(!showHistory)
  }

  function onNumberClick(value: number){
    setCurrentOperation([...currentOperation, value.toString()])
  }

  function onCommaClick(){
    const lastAdded = currentOperation.at(-1);
    if(lastAdded === "."){
      return
    }

    if(operators.find((operator)=> lastAdded?.includes(operator.symbole))){
      setCurrentOperation([...currentOperation, "0", "."])
      return
    }

    if(!currentOperation.length){
      setCurrentOperation(["0", "."])
      return
    }
    
    setCurrentOperation([...currentOperation, "."])
  }

  function onRemoveOneBtnClick(){
    setCurrentOperation(currentOperation.slice(0, currentOperation.length - 1))
  }

  function onOperatorClick(symbole: string){
    if(!currentOperation.length){
      return
    }

    const lastAdded = currentOperation.at(-1);
    const wasOperator = operators.find((operator)=> lastAdded?.includes(operator.symbole));
    if(wasOperator){
      setCurrentOperation([...getOperationWithoutLastAdded(), ` ${symbole} `])
    }else{
      setCurrentOperation([...currentOperation, ` ${symbole} `]) 
    }
  }

  function onAnswerBtnClick(){
    try{
      const result = eval(toEvaluate());
      setHistory([currentOperation, ...history,]);
      setCurrentOperation(result.toString().split(", "));
    }catch(e){
      setError(true);
      setCurrentOperation([]);
    }
  }

  return (
    <div className="sm:max-w-[400px] w-full px-3 sm:px-0 mx-auto mt-10">
      <div className="w-full h-32 text-lg bg-slate-50 p-3 flex flex-col justify-between relative">
          <div className="flex justify-end">
            <button onClick={toggleShowHistory} ref={historyBtnRef}>
              <i className="text-sm">History</i>
            </button>
          </div>

          <div className="flex justify-end items-center sm:text-2xl text-xl overflow-auto">
              {currentOperation.length ? currentOperation.join('') : error ? "Error" : "0"}
          </div>

          {showHistory &&
          <div className="absolute top-12 right-0 w-full px-3"
          >
            <ul className="bg-white rounded-lg p-3 shadow flex flex-col gap-2 overflow-auto text-sm">
              {history.map((operation, index)=>(
                <li className="p-3 border rounded-lg overflow-auto" key={index}>
                    <button>
                      {operation.join('') + " = " + eval(toEvaluate(operation))}
                    </button>
                </li>
              ))}
            </ul>
          </div>}
      </div>

      <div className="flex">
        <div className="text-xl gap-5 p-4 sm:text-2xl grow grid grid-cols-3 grid-rows-4 bg-gray-600 text-white">
          {numbers.map((number)=>(
            <button className="hover:bg-slate-500 rounded-full"
            onClick={()=>onNumberClick(number)} key={number}>
              {number}
            </button>
          ))}
          <button className="hover:bg-slate-500 rounded-full"
          onClick={onCommaClick}>
            .
          </button>
          <button className="hover:bg-slate-500 rounded-full"
          onClick={()=>onNumberClick(0)}>
            0
          </button>
          <button className="hover:bg-slate-500 rounded-full"
          onClick={onAnswerBtnClick}>
            =
          </button>
        </div>
        <div className="flex flex-col bg-slate-400 text-white gap-3">
          <button className="px-7 py-5 sm:text-2xl text-lg hover:bg-gray-600"
          onClick={onRemoveOneBtnClick}>
              CE
          </button>
          {operators.map((operator)=>(
            <button className="px-7 py-5 sm:text-2xl text-lg hover:bg-gray-600"
            onClick={()=>onOperatorClick(operator.symbole)} key={operator.name}>
              {operator.symbole}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

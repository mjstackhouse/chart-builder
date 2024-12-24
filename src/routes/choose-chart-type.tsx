import { Link, useNavigate } from "react-router-dom";
import { useUserSelections } from "../customElement/CustomElementContext";

export default function ChooseChartType() {
  const navigate = useNavigate();
  const [selections, setSelections] = useUserSelections();

  function handleNavigate(type: string) {
    if (type !== selections?.type) setSelections({type: type});
    else setSelections({...selections, type: type});
    // setSelections({...selections, type: type});
    navigate(`/type/${type}/configure`);
  }

  return (
    <div className='flex flex-wrap h-[600px]'>
      <div className='basis-full flex flex-wrap'>
        <div className='basis-full mb-6'>
          <h1 className='mb-6 font-bold basis-full'>Choose your chart type</h1>
          <ul className='flex flex-wrap gap-y-6'>
            <li className='basis-full flex'>
              <button onClick={() => handleNavigate('bar')} className='basis-1/4 btn continue-btn'>
                Bar
              </button>
            </li>
            <li className='basis-full flex'>
              <button onClick={() => handleNavigate('pie')} className='basis-1/4 btn continue-btn'>
                Pie
              </button>
            </li>
            <li className='basis-full flex'>
              <button onClick={() => handleNavigate('line')} className='basis-1/4 btn continue-btn'>
                Line
              </button>
            </li>
          </ul>
        </div>
        <div className='justify-self-end basis-full flex place-items-end justify-between'>
          <Link to='../../home' draggable={false} relative='path' className='btn back-btn'>Go back to home</Link>
        </div>
      </div>
    </div>
  );
}

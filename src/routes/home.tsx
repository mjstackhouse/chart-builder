import { Link } from "react-router-dom";
import { useValue } from "../customElement/CustomElementContext";
import NewChartWarning from "../warnings/new-chart-warning";
import { useEffect } from "react";

export default function Home() {
  const [elementValue] = useValue();

  let parsedElementValue;

  if (elementValue?.userSelections !== null && elementValue?.userSelections !== undefined) parsedElementValue = JSON.parse(elementValue?.userSelections as string);

  useEffect(() => {
    handleClick('useEffect');
  }, []);

  function handleClick(event: string) {
    if (event === 'useEffect') {
      const newChartWarningContainer = document.getElementById('new-chart-warning-container');
      if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'none';
    }
    else {
      const newChartWarningContainer = document.getElementById('new-chart-warning-container');
      if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'block';
    }
  }

  return (
    <div className='flex flex-wrap h-[600px]'>
      { elementValue !== null && elementValue !== undefined ? 
          elementValue?.userSelections !== null && elementValue?.userSelections !== undefined ? 
          <div className='flex flex-wrap h-[500px] w-full'>
            <div className='basis-full flex flex-wrap justify-around mb-8'>
              <h1 className='basis-full font-bold'>Existing Chart Preview</h1>
              <div className='basis-full flex justify-around items-center h-[500px]'>
                <img className='max-h-[500px] max-w-full' src={elementValue?.valueKey} />
              </div>
            </div>
            <div className='justify-self-end basis-full flex justify-between'>
              <button onClick={() => {handleClick('click')}} className='btn back-btn'>Create new chart</button>
              <Link to={`../type/${parsedElementValue.type}/configure`} draggable={false} className='btn continue-btn'>Edit existing chart</Link>
            </div>
            <NewChartWarning />
          </div>
        : <div className='h-[600px] w-full'>
            <h1 className='font-bold mb-6'>No Existing Chart</h1>
            <div className='basis-full flex'>
              <Link to='../type' draggable={false} className='btn continue-btn basis-1/4'>Create chart</Link>
            </div>
          </div>
      : <div className='h-[600px] w-full'>
          <h1 className='font-bold mb-6'>No Existing Chart</h1>
          <div className='basis-full flex'>
            <Link to='../type' draggable={false} className='btn continue-btn basis-1/4'>Create chart</Link>
          </div>
        </div> }
    </div>
  );
}
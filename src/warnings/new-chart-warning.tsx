import { Link } from "react-router-dom";

export default function NewChartWarning() {
  
  function handleClick() {
    const newChartWarningContainer = document.getElementById('new-chart-warning-container');
    if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'none';
  }

  return (
    <div id='new-chart-warning-container' className='absolute top-0 left-0 flex flex-wrap w-full h-full bg-white z-10'>
      <h1 className='font-bold mb-4'>Create new chart</h1>
      <p className='text-[16px] mb-8'>Are you sure you want to <strong>create a new chart and overwrite your existing chart?</strong></p>
      <div className='basis-full flex justify-between'>
        <button onClick={handleClick} className='btn back-btn'>Cancel</button>
        <Link to='../type' className='btn warning-btn'>Create new chart</Link>
      </div>
    </div>
  );
}
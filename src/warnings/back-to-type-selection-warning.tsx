import { Link } from "react-router-dom";

export default function BackToTypeSelectionWarning() {

  function handleClick() {
    const backToTypeSelectionWarningContainer = document.getElementById('back-to-type-selection-warning-container');
    if (backToTypeSelectionWarningContainer !== null) backToTypeSelectionWarningContainer.style.display = 'none';
  }

  return (
    <div id='back-to-type-selection-warning-container' className='absolute top-0 left-0 flex flex-wrap w-full h-full bg-white z-10'>
      <h1 className='font-bold mb-4'>Choose new chart type</h1>
      <p className='text-[16px] mb-8'>Are you sure you want to <strong>choose a new chart type and erase your current selections?</strong></p>
      <div className='basis-full flex justify-between'>
        <button onClick={handleClick} className='btn back-btn'>Cancel</button>
        <Link to='../type' className='btn warning-btn'>Choose new chart type</Link>
      </div>
    </div>
  );
}
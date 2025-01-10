import { Outlet, useNavigate } from "react-router-dom";
import { useIsDisabled, useValue } from '../customElement/CustomElementContext';
import { useEffect } from "react";

export default function Root() {
  const isDisabled = useIsDisabled();
  const navigate = useNavigate();
  const [elementValue] = useValue();

  useEffect(() => {
    const pathname = window.location.pathname;

    if (isDisabled === false && pathname === '/') {
      navigate('/home');
    }
  })

  return (
    <div>
      { isDisabled === false ?
        <div id='detail'>
          <Outlet />
        </div>
        : <div className='flex flex-wrap h-[600px]'>
            <div className='basis-full flex flex-wrap justify-around mb-8'>
              <h1 className='basis-full font-bold'>Existing Chart Preview</h1>
              <div className='basis-full flex justify-around items-center h-[500px]'>
                <img className='max-h-[500px] max-w-full' src={elementValue?.valueKey} />
              </div>
            </div>
          </div>
      }
    </div>
  );
}
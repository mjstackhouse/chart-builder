import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
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
        : <div>
            <div>
              <h1 className='font-bold'>Existing Chart Preview</h1>
              <img src={elementValue?.valueKey} />
            </div>
          </div>
      }
    </div>
  );
}
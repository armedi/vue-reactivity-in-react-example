import React, { useState, useEffect, useMemo } from 'react';
import { reactive, ref, isRef, effect, stop } from '@vue/reactivity';

const access = (object) => {
  if (isRef(object)) {
    access(object.value);
  } else if (typeof object === 'object') {
    for (let key of Object.keys(object)) {
      access(object[key]);
    }
  }
};

const setup = (setupFn) => (Component) => (props) => {
  const setupProps = useMemo(setupFn, []);
  const [, setTick] = useState(0);
  useEffect(() => {
    const reactiveEffect = effect(() => {
      access(setupProps);
      setTick((tick) => tick + 1);
    });

    return () => stop(reactiveEffect);
  }, [setupProps]);

  return <Component {...props} {...setupProps} />;
};

function App({ count, name }) {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <input
        className="block w-64 rounded-md p-3 mb-4 sm:text-sm sm:leading-5"
        placeholder="Input your name"
        onChange={(e) => (name.first = e.target.value)}
      />
      <div className="shadow-lg bg-white rounded-lg w-64">
        <div className="text-center my-8">Hi, {name.first}</div>
        <div className="text-6xl text-center my-10">{count.value}</div>
        <div className="flex justify-center my-6">
          <span className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 text-sm leading-6 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              onClick={() => count.value--}
            >
              Decrement
            </button>
          </span>
          <span className="inline-flex rounded-md shadow-sm ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 text-sm leading-6 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              onClick={() => count.value++}
            >
              Increment
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default setup(() => {
  const count = ref(0);
  const name = reactive({ first: '' });

  return { count, name };
})(App);

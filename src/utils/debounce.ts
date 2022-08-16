// const debounce = (callback: () => void, wait: number = 300) => {
//   let timeout: number | undefined;

//   return (...args: any[]) => {
//     const later = () => {
//       console.log("execute", wait);
//       clearTimeout(timeout);
//       callback(...args);
//     };

//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// };

// export default debounce;

// leading debounce
export const debounce = (
  callback: (arg: any) => void,
  delay: number = 300,
  direction: 1 | -1 | 0
) => {
  let timer: number | undefined = undefined;

  const later = () => {
    console.log("debounce", timer);
    if (!timer) {
      console.log("function call");
      callback(direction);
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = undefined;
    }, delay);
  };

  return later();
};

export const throttle = (callback: () => void, limit: number) => {
  var waiting = false;
  return () => {
    if (!waiting) {
      callback.apply(this);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

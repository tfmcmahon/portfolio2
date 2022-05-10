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
export const debounce = (callback: () => void, delay: number = 300) => {
  let timer: number | undefined = undefined;

  return () => {
    if (!timer) {
      callback();
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = undefined;
    }, delay);
  };
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

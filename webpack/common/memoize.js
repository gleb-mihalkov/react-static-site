/**
 * Возвращает мемоизованную функцию.
 * @param {Function} fn Функция.
 */
export const memoize = (fn) => {
  let isExecuted = false;
  let result;

  return (...args) => {
    if (isExecuted) {
      return result;
    }

    result = fn(...args);
    isExecuted = true;

    return result;
  };
};
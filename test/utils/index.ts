// eslint-disable-next-line import/prefer-default-export
export const sleep = async (time: number = 5000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const timeFormat = (time) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;

  return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
};

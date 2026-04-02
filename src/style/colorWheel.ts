export const COLORWHEEL = ['#F27A7A', '#daa641', '#5eb537', '#98E0CF', '#93A7F0', '#AA83EB', '#EB97F9'];

export const pickRandomColor = () => {
  const randomIdx = Math.floor(Math.random() * COLORWHEEL.length);
  return COLORWHEEL[randomIdx];
};

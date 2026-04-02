export const useNavigator = () => {
  // Study-only URL query parameters were removed for public release.
  const isBaseline = false;
  const isDev = false;
  return { isBaseline, isDev };
};

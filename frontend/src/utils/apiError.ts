export const getApiErrorMessage = (
  error: any,
  fallback = "Something went wrong"
) => {
  const message = error?.response?.data?.message;
  const firstError = error?.response?.data?.errors?.[0];

  if (message && firstError) return `${message} : ${firstError}`;
  return message || firstError || fallback;
};

export const httpResponse = (
  success: boolean,
  message: string,
  data: any = {},
  page: number = 1
) => {
  return Object.freeze({
    success,
    message,
    page,
    data,
  });
};

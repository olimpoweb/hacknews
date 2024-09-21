import { AxiosResponse } from 'axios';

export async function handleException(response: AxiosResponse): Promise<Error> {
  
  const responseBody = await response.data; 
  const statusCode = response.status;

  const errorMessages: { [key: number]: string } = {
    400: `Bad request.`,
  };

  const errorMessage = errorMessages[statusCode] || `An error occurred with status code ${statusCode}`;

  console.error("Error fetching data:", errorMessage);

  return new Error(errorMessage);
}
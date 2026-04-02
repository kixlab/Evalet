export async function requestSafeJSON(requestFn: () => Promise<any>, maxAttempts = 3): Promise<any> {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const response = await requestFn();

      const content = response?.choices[0].message.content;
      const cleanedResponse = content?.split('```json')[1]?.split('```')[0] ?? '';
      console.log(content);

      const targetJSON = JSON.parse(cleanedResponse);
      return targetJSON;
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} failed: ${error}`);
      if (attempt >= maxAttempts) {
        throw new Error(`Failed to parse JSON after ${maxAttempts} attempts: ${error}`);
      }
    }
  }
}

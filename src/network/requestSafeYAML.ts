import YAML from 'yaml';

export async function requestSafeYAML(requestFn: () => Promise<any>, maxAttempts = 1): Promise<any> {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const response = await requestFn();

      const content = response?.choices[0].message.content;
      const cleanedResponse = content?.split('```yaml')[1]?.split('```')[0] ?? '';
      console.log(content);

      const targetYAML = YAML.parse(cleanedResponse);

      if (!targetYAML || typeof targetYAML !== 'object' || !('evaluations' in targetYAML)) {
        throw new Error(`Missing 'evaluations' field in YAML response`);
      }

      return targetYAML;
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} failed: ${error}`);
      if (attempt >= maxAttempts) {
        throw new Error(`Failed to parse JSON after ${maxAttempts} attempts: ${error}`);
      }
    }
  }
}

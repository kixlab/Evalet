import OpenAI from 'openai';
import YAML from 'yaml';

const models = {
  openai: [
    'gpt-4-turbo',
    'gpt-4-turbo-2024-04-09',
    'gpt-4-turbo-preview',
    'gpt-4-0125-preview',
    'gpt-4-1106-preview',
    'gpt-4',
    'gpt-4-0613',
    'gpt-4-32k',
    'gpt-4-32k-0613',
    'gpt-3.5-turbo-0125',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-1106',
    'gpt-4o',
    'o3-mini',
  ],
  google: ['gemini-1.5-pro', 'gemini-1.0-pro'],
};

class LLMRequestManager {
  private constructor() {}
  private openAiAPIKey = '';
  private openAiObject: OpenAI | null = null;

  public static shared = new LLMRequestManager();

  getOpenAIAPIKey() {
    return this.openAiAPIKey;
  }

  setOpenAIAPIKey(key: string) {
    this.openAiAPIKey = key;
    if (key !== '') this.openAiObject = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  }

  async requestOpenAIAPI(model: string, systemPrompt: string, userPrompt: string, max_tokens: number, temperature: number, n: number) {
    if (this.openAiAPIKey === '' || this.openAiObject === null) {
      window.alert('You should update the API Key');
      return;
    }
    try {
      const request: OpenAI.ChatCompletionCreateParamsNonStreaming = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        n: n,
      };
      if (!model.includes('o3')) {
        request.max_tokens = max_tokens;
        request.temperature = temperature;
      }
      const response = await this.openAiObject.chat.completions.create(request);
      return response;
    } catch (err) {
      throw new Error(`LLM Request Error: ${err}`);
    }
  }

  async requestOpenAIAPIMany(
    model: string,
    systemPrompt: string,
    idUserPrompts: { id: string; prompt: string }[],
    max_tokens: number,
    temperature: number,
    n: number,
  ) {
    if (this.openAiAPIKey === '' || this.openAiObject === null) {
      window.alert('You should update the API Key');
      return;
    }
    try {
      // 여러 요청을 병렬로 처리
      const requests = idUserPrompts.map(({ prompt }) => {
        const request: OpenAI.ChatCompletionCreateParamsNonStreaming = {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          n: n,
        };
        if (!model.includes('o3')) {
          request.max_tokens = max_tokens;
          request.temperature = temperature;
        }
        return this.openAiObject!.chat.completions.create(request);
      });

      const responses = await Promise.all(requests);

      // Claude와 동일한 형태로 변환: { dataId, evaluations }
      return responses.map((response, index) => {
        const content = response?.choices[0]?.message?.content;
        if (!content) {
          return {
            dataId: idUserPrompts[index].id,
            evaluations: undefined,
          };
        }

        // YAML 파싱 (```yaml ... ``` 부분 추출)
        const cleanedResponse = content.split('```yaml')[1]?.split('```')[0] ?? content.split('```')[1]?.split('```')[0] ?? '';

        try {
          const targetYAML = YAML.parse(cleanedResponse);
          if (!targetYAML || typeof targetYAML !== 'object' || !('evaluations' in targetYAML)) {
            return {
              dataId: idUserPrompts[index].id,
              evaluations: undefined,
            };
          }
          return {
            dataId: idUserPrompts[index].id,
            evaluations: targetYAML.evaluations,
          };
        } catch (error) {
          console.warn(`Failed to parse YAML for dataId ${idUserPrompts[index].id}:`, error);
          return {
            dataId: idUserPrompts[index].id,
            evaluations: undefined,
          };
        }
      });
    } catch (err) {
      throw new Error(`LLM Request Error: ${err}`);
    }
  }

  async requestOpenAIEmbedding(inputs: string[]) {
    if (this.openAiAPIKey === '' || this.openAiObject === null) {
      window.alert('You should update the API Key');
      return;
    }
    try {
      const response = await this.openAiObject.embeddings.create({
        model: 'text-embedding-3-small',
        input: inputs,
      });
      return response.data;
    } catch (err) {
      throw new Error(`LLM Embedding Error: ${err}: ${inputs.join(', ')}`);
    }
  }

  async requestClaudeAPI(model: string, systemPrompt: string, userPrompt: string, max_tokens: number, temperature: number, n: number) {
    throw new Error('Anthropic API is disabled in this project.');
  }

  async requestClaudeAPIMany(
    model: string,
    systemPrompt: string,
    idUserPrompts: { id: string; prompt: string }[],
    max_tokens: number,
    temperature: number,
    n: number,
  ) {
    throw new Error('Anthropic API is disabled in this project.');
  }
}

export default LLMRequestManager;

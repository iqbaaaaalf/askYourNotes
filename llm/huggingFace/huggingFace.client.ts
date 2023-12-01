import axios from "axios";
import IBaseLLMProcessor from "../../model/IBaseLLMProcessor";
import config from "../../config";

class HuggingFaceClient extends IBaseLLMProcessor {
  private completionPath = '/v1/chat/completions';
  private timeout = 60000;
  baseUrl = config.llmBaseUrl;

  async exec(): Promise<string> {
    if (!this.userQuery) {
      throw new Error('User query is not set');
    }

    const payload = {
      messages: [
        this.systemQuery.toPrompt(),
        this.userQuery.toPrompt()
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: false
    };
  
    const url = `${this.baseUrl}${this.completionPath}`;
  
    const headers = {
      "Content-Type": "application/json",
    };
  
    let response;
  
    try {
      response = await axios.post(url, payload, {
        headers,
        timeout: this.timeout
      });
    } catch (error) {
      // TODO(fakhri): handle unexpected error from lmstudio huggingface
      console.log(error);

      throw error;
    }
  
    const content = response.data.choices[0].message.content;

    return content;
  }
}

export default HuggingFaceClient;
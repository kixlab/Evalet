export interface Output {
  id: string;
  inputId: string;
  promptId: string;
  content: string;
  uploadedByUser: boolean; // Flag to indicate whether it is uploaded as input-output pair.
}

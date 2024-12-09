import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN;
const inference = new HfInference(HF_TOKEN);

const model = "openai/whisper-tiny.en";

const huggingface2 = async (audioStream: Blob | undefined) => {
  const result = await inference.automaticSpeechRecognition({
    data: audioStream!,
    model: model,
  });
  return result;
};
export default huggingface2;

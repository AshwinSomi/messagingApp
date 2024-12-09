"use client";
import React, { useEffect, useRef, useState } from "react";

import huggingface2 from "@/utiles/transcribe";
import axios from "axios";
import { AudioLines } from "lucide-react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
  me: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ me, chatId, chatPartner }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [recodingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [duration, setDuration] = useState<number>(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mimeType = "audio/webm";

  // Starts recording
  const startRecording = async () => {
    let tempStream: MediaStream;

    console.log("start recording");

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (err) {
      console.log((err as Error).message);
      return;
    }

    setRecordingStatus("recording");

    // removed type: mimeType
    const media = new MediaRecorder(tempStream, { mimeType });
    mediaRecorder.current = media;

    mediaRecorder.current.start();
    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
      if (typeof e.data === "undefined") {
        return;
      }
      if (e.data.size === 0) {
        return;
      }
      localAudioChunks.push(e.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async (): Promise<Blob> => {
    setRecordingStatus("inactive");
    console.log("Stop recording");

    return new Promise((resolve, reject) => {
      if (!mediaRecorder.current) {
        reject(new Error("MediaRecorder is not initialized"));
        return;
      }
      mediaRecorder.current?.stop();
      mediaRecorder.current!.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        setAudioChunks([]);
        setDuration(0);
        resolve(audioBlob);
      };
    });
  };

  // To count time when recording message
  useEffect(() => {
    if (recodingStatus === "inactive") {
      return;
    }
    const interval = setInterval(() => {
      setDuration((curr) => curr + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [recodingStatus]);

  const handleSend = async (audioBlob: Blob) => {
    if (!audioBlob) {
      console.error("No audio stream available");
      return;
    }

    const audio_res = await huggingface2(audioBlob);
    setInput(audio_res.text);
  };

  //sending message to update in database
  const sendMessage = async () => {
    if (!input) {
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0 ">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 ">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={me ? "Message Mee" : `Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6 "
        />
        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex flex-col  gap-2 items-end py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <div className=" flex flex-row gap-1 items-center duration-200 px-2 ">
              <AudioLines
                onClick={
                  recodingStatus === "inactive"
                    ? () => startRecording()
                    : async () => {
                        const audioBlob = await stopRecording();
                        // having trouble doing two function at the same time
                        handleSend(audioBlob);
                      }
                }
                className={
                  recodingStatus === "recording"
                    ? "text-red-600 hover:cursor-pointer "
                    : "text-gray-500 hover:text-gray-700 duration-200 hover:cursor-pointer hover:scale-105"
                }
              />
              {recodingStatus === "recording" && (
                <p className="text-sm text-gray-500 font-semibold">
                  {duration}s
                </p>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button isLoading={isLoading} onClick={sendMessage} type="submit">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

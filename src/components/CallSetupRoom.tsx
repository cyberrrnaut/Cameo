import { DeviceSettings, useCall, useCallStateHooks, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Alert } from './ui/alert';

export default function CallSetupRoom({ setSetupComplete}: {setSetupComplete: (value: boolean) => void;
}) {

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);
 

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
    <h1 className="text-center text-2xl font-bold">Check your video and audio</h1>
    <VideoPreview />
    <div className="flex h-16 items-center justify-center gap-3">
      <label className="flex items-center justify-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={isMicCamToggled}
          onChange={(e) => setIsMicCamToggled(e.target.checked)}
        />
        Join with mic and camera off
      </label>
      <DeviceSettings />
    </div>
    <Button
      className="rounded-md bg-green-500 px-4 py-2.5"
      onClick={() => {
        call.join();

        setSetupComplete(true);
      }}
    >
      Join meeting
    </Button>
  </div>
  )
}

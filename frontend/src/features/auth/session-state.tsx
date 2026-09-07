import { LoadingState } from "../../components/ui/loading-state";

export function SessionState({ message }: { message: string }) {
  return <LoadingState message={message} />;
}

import Loader from "@/components/ui/loader";
import { useAppContent } from "@/hooks/useAppContent";

export const Imprint = () => {
  const { content, loading } = useAppContent();
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: content ? content.imprint : "" }}
        />
      )}
    </>
  );
};

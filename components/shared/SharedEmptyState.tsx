type SharedEmptyStateProps = {
  tab: "withMe" | "byMe";
};

export function SharedEmptyState({ tab }: SharedEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-[30px] py-[80px]">
      <p className="text-[16px] text-grey-3">
        {tab === "withMe"
          ? "No files shared with you yet"
          : "You haven't shared any files yet"}
      </p>
      {tab === "byMe" ? (
        <p className="mt-[8px] text-[14px] text-grey-4">
          Share a document from All files to see it here.
        </p>
      ) : null}
    </div>
  );
}

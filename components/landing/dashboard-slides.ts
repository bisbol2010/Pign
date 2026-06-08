export type DashboardSlide = {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  figmaNodeId: string;
};

export const DASHBOARD_SLIDES: DashboardSlide[] = [
  {
    id: "inbox-list",
    title: "Inbox list workflow",
    imageSrc: "/landing/carousel/slide-inbox-list.png",
    imageAlt:
      "Pign inbox list view showing grouped messages and selected document rows.",
    figmaNodeId: "2737:545",
  },
  {
    id: "file-viewer",
    title: "Document viewer workflow",
    imageSrc: "/landing/carousel/slide-file-viewer.png",
    imageAlt:
      "Pign document viewer showing file preview, metadata and print actions.",
    figmaNodeId: "2737:717",
  },
];

export type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  logoSrc: string;
  logoAlt: string;
  comingSoon?: boolean;
};

export const INTEGRATION_ROWS: [IntegrationItem[], IntegrationItem[], IntegrationItem[]] =
  [
    [
      {
        id: "slack",
        name: "Slack",
        description: "Post verified document alerts to channels with secure deep links.",
        logoSrc: "/landing/integrations/slack.svg",
        logoAlt: "Slack logo",
        comingSoon: true,
      },
      {
        id: "google-drive",
        name: "Google Drive",
        description: "Sync selected folders into Pign with verification metadata.",
        logoSrc: "/landing/integrations/google-drive.svg",
        logoAlt: "Google Drive logo",
        comingSoon: true,
      },
      {
        id: "dropbox",
        name: "Dropbox",
        description: "Import contracts and IDs from Dropbox without duplicate uploads.",
        logoSrc: "/landing/integrations/dropbox.svg",
        logoAlt: "Dropbox logo",
        comingSoon: true,
      },
      {
        id: "box",
        name: "Box",
        description: "Mirror regulated document libraries and preserve access rules.",
        logoSrc: "/landing/integrations/box.svg",
        logoAlt: "Box logo",
        comingSoon: true,
      },
    ],
    [
      {
        id: "onedrive",
        name: "Microsoft OneDrive",
        description: "Keep personal and team files aligned with Pign records.",
        logoSrc: "/landing/integrations/onedrive.svg",
        logoAlt: "Microsoft OneDrive logo",
        comingSoon: true,
      },
      {
        id: "sharepoint",
        name: "SharePoint",
        description: "Route approved documents to enterprise libraries automatically.",
        logoSrc: "/landing/integrations/sharepoint.svg",
        logoAlt: "SharePoint logo",
        comingSoon: true,
      },
      {
        id: "gmail-workspace",
        name: "Gmail / Google Workspace",
        description: "Forward important emails and attachments to Pign.",
        logoSrc: "/landing/integrations/gmail.svg",
        logoAlt: "Gmail logo",
        comingSoon: true,
      },
    ],
    [
      {
        id: "outlook-m365",
        name: "Outlook / Microsoft 365",
        description: "Capture email threads and attached files for audit trails.",
        logoSrc: "/landing/integrations/outlook.svg",
        logoAlt: "Outlook logo",
        comingSoon: true,
      },
      {
        id: "notion",
        name: "Notion",
        description: "Embed verified documents in workspace pages and project docs.",
        logoSrc: "/landing/integrations/notion.svg",
        logoAlt: "Notion logo",
        comingSoon: true,
      },
      {
        id: "zapier",
        name: "Zapier",
        description: "Trigger no-code workflows when documents are uploaded or verified.",
        logoSrc: "/landing/integrations/zapier.svg",
        logoAlt: "Zapier logo",
        comingSoon: true,
      },
      {
        id: "api-webhooks",
        name: "REST API + Webhooks",
        description:
          "Build custom automations from upload, verify, and share events.",
        logoSrc: "/landing/integrations/api-webhooks.svg",
        logoAlt: "API and webhooks icon",
        comingSoon: true,
      },
    ],
  ];

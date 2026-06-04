import type { SVGProps } from "react";

/**
 * Exact icon set extracted from the Pign Figma design system
 * (file DH23JKHKdPD3NEgtz6cU6G). Glyphs are 24×24 filled paths that
 * inherit `currentColor`, so callers control color with text-* classes.
 *
 * Keeping these as inline components (rather than <img>) preserves the
 * exact Figma geometry while letting active/inactive states recolor.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function SvgIcon({
  size = 24,
  children,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function FilesIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 8L9.003 2H19.998C20.55 2 21 2.455 21 2.992V21.008C20.9997 21.2712 20.895 21.5235 20.7088 21.7095C20.5226 21.8955 20.2702 22 20.007 22H3.993C3.86168 21.9991 3.73182 21.9723 3.61085 21.9212C3.48987 21.8701 3.38015 21.7957 3.28794 21.7022C3.19573 21.6087 3.12284 21.4979 3.07344 21.3762C3.02403 21.2545 2.99908 21.1243 3 20.993V8Z" />
    </SvgIcon>
  );
}

export function TeamsIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 11C13.3261 11 14.5979 11.5268 15.5355 12.4645C16.4732 13.4021 17 14.6739 17 16V22H7V16C7 14.6739 7.52678 13.4021 8.46447 12.4645C9.40215 11.5268 10.6739 11 12 11ZM5.288 14.006C5.12886 14.5428 5.03485 15.0968 5.008 15.656L5 16V22H2V17.5C1.9998 16.6376 2.31803 15.8054 2.89363 15.1632C3.46924 14.521 4.2617 14.1139 5.119 14.02L5.289 14.006H5.288ZM18.712 14.006C19.6019 14.0602 20.4376 14.452 21.0486 15.1012C21.6596 15.7505 21.9999 16.6084 22 17.5V22H19V16C19 15.307 18.9 14.638 18.712 14.006ZM5.5 8C6.16304 8 6.79893 8.26339 7.26777 8.73223C7.73661 9.20107 8 9.83696 8 10.5C8 11.163 7.73661 11.7989 7.26777 12.2678C6.79893 12.7366 6.16304 13 5.5 13C4.83696 13 4.20107 12.7366 3.73223 12.2678C3.26339 11.7989 3 11.163 3 10.5C3 9.83696 3.26339 9.20107 3.73223 8.73223C4.20107 8.26339 4.83696 8 5.5 8V8ZM18.5 8C19.163 8 19.7989 8.26339 20.2678 8.73223C20.7366 9.20107 21 9.83696 21 10.5C21 11.163 20.7366 11.7989 20.2678 12.2678C19.7989 12.7366 19.163 13 18.5 13C17.837 13 17.2011 12.7366 16.7322 12.2678C16.2634 11.7989 16 11.163 16 10.5C16 9.83696 16.2634 9.20107 16.7322 8.73223C17.2011 8.26339 17.837 8 18.5 8V8ZM12 2C13.0609 2 14.0783 2.42143 14.8284 3.17157C15.5786 3.92172 16 4.93913 16 6C16 7.06087 15.5786 8.07828 14.8284 8.82843C14.0783 9.57857 13.0609 10 12 10C10.9391 10 9.92172 9.57857 9.17157 8.82843C8.42143 8.07828 8 7.06087 8 6C8 4.93913 8.42143 3.92172 9.17157 3.17157C9.92172 2.42143 10.9391 2 12 2V2Z" />
    </SvgIcon>
  );
}

/** Shield with check — sidebar Verification nav (Figma). */
export function VerificationIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2ZM10.29 16.29L7.7 13.7L6.29 15.12L10.29 19.12L17.71 11.71L16.29 10.29L10.29 16.29Z" />
    </SvgIcon>
  );
}

/** People glyph used in the file table "SHARED" column (same as Teams). */
export const SharedCellIcon = TeamsIcon;

export function EmailsIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3V3ZM12.06 11.683L5.648 6.238L4.353 7.762L12.073 14.317L19.654 7.757L18.346 6.244L12.061 11.683H12.06Z" />
    </SvgIcon>
  );
}

export function SharedIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M16 2L21 7V21.008C20.9997 21.2712 20.895 21.5235 20.7088 21.7095C20.5226 21.8955 20.2702 22 20.007 22H3.993C3.73038 21.9982 3.47902 21.8931 3.29322 21.7075C3.10742 21.5219 3.00209 21.2706 3 21.008V2.992C3 2.444 3.445 2 3.993 2H16ZM12 11H8V13H12V16L16 12L12 8V11Z" />
    </SvgIcon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M17 6H22V8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8H2V6H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z" />
    </SvgIcon>
  );
}

export function StorageIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M11 2.05V13H21.95C21.449 18.053 17.185 22 12 22C6.477 22 2 17.523 2 12C2 6.815 5.947 2.551 11 2.05V2.05ZM13 2.05C15.295 2.2812 17.4396 3.29842 19.0706 4.92944C20.7016 6.56045 21.7188 8.70501 21.95 11H13V2.05Z" />
    </SvgIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.867 18 18 14.867 18 11C18 7.132 14.867 4 11 4C7.132 4 4 7.132 4 11C4 14.867 7.132 18 11 18ZM19.485 18.071L22.314 20.899L20.899 22.314L18.071 19.485L19.485 18.071V18.071Z" />
    </SvgIcon>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11 15V17H13V15H11ZM13 13.355C13.8037 13.1128 14.4936 12.59 14.9442 11.8817C15.3947 11.1735 15.5759 10.3271 15.4547 9.49647C15.3336 8.66588 14.9181 7.90644 14.284 7.35646C13.6499 6.80647 12.8394 6.50254 12 6.5C11.1909 6.49994 10.4067 6.78015 9.78079 7.29299C9.15492 7.80583 8.72601 8.51963 8.567 9.313L10.529 9.706C10.5847 9.42743 10.7183 9.1704 10.9144 8.96482C11.1104 8.75923 11.3608 8.61354 11.6364 8.54471C11.912 8.47587 12.2015 8.48671 12.4712 8.57597C12.7409 8.66523 12.9797 8.82924 13.1598 9.04891C13.34 9.26858 13.454 9.53489 13.4887 9.81684C13.5234 10.0988 13.4773 10.3848 13.3558 10.6416C13.2343 10.8984 13.0423 11.1154 12.8023 11.2673C12.5623 11.4193 12.2841 11.5 12 11.5C11.7348 11.5 11.4804 11.6054 11.2929 11.7929C11.1054 11.9804 11 12.2348 11 12.5V14H13V13.355Z" />
    </SvgIcon>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M22 20H2V18H3V11.031C3 6.043 7.03 2 12 2C16.97 2 21 6.043 21 11.031V18H22V20ZM9.5 21H14.5C14.5 21.663 14.2366 22.2989 13.7678 22.7678C13.2989 23.2366 12.663 23.5 12 23.5C11.337 23.5 10.7011 23.2366 10.2322 22.7678C9.76339 22.2989 9.5 21.663 9.5 21V21Z" />
    </SvgIcon>
  );
}

/** Person-in-circle glyph used as the default profile avatar. */
export function AccountIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.023 15.416C7.491 17.606 9.695 19 12.16 19C14.624 19 16.829 17.607 18.296 15.416C16.6317 13.8606 14.4379 12.9968 12.16 13C9.88171 12.9966 7.68751 13.8604 6.023 15.416V15.416ZM12 11C12.7956 11 13.5587 10.6839 14.1213 10.1213C14.6839 9.55871 15 8.79565 15 8C15 7.20435 14.6839 6.44129 14.1213 5.87868C13.5587 5.31607 12.7956 5 12 5C11.2044 5 10.4413 5.31607 9.87868 5.87868C9.31607 6.44129 9 7.20435 9 8C9 8.79565 9.31607 9.55871 9.87868 10.1213C10.4413 10.6839 11.2044 11 12 11V11Z" />
    </SvgIcon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 13.172L16.95 8.222L18.364 9.636L12 16L5.636 9.636L7.05 8.222L12 13.172Z" />
    </SvgIcon>
  );
}

export function ViewListIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" />
    </SvgIcon>
  );
}

export function ViewGridIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M22 12.999V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H13V12.999H22ZM11 12.999V21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V12.999H11V12.999ZM11 3V10.999H2V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H11ZM21 3C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V10.999H13V3H21Z" />
    </SvgIcon>
  );
}

export function VerifiedIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11.003 16L18.073 8.929L16.659 7.515L11.003 13.172L8.174 10.343L6.76 11.757L11.003 16Z" />
    </SvgIcon>
  );
}

/** File-with-plus glyph shown inside the sidebar upload dropzone (66×66). */
export function UploadFileGlyphIcon({ size = 66, ...props }: IconProps) {
  return (
    <SvgIcon size={size} viewBox="0 0 66 66" {...props}>
      <path d="M44 5.5L57.75 19.25V57.772C57.7493 58.4958 57.4612 59.1896 56.9492 59.7012C56.4372 60.2127 55.743 60.5 55.0192 60.5H10.9808C10.2585 60.495 9.5673 60.206 9.05635 59.6956C8.5454 59.1852 8.25576 58.4942 8.25 57.772V8.228C8.25 6.721 9.47375 5.5 10.9808 5.5H44ZM30.25 30.25H22V35.75H30.25V44H35.75V35.75H44V30.25H35.75V22H30.25V30.25Z" />
    </SvgIcon>
  );
}

/**
 * Generic file thumbnail placeholder (non-image files). Two-tone:
 * #B3B3B3 page fill with #F2F2F2 lines. 31×31 in the Figma source.
 */
/** Folder thumbnail in list/grid rows (31×31, grey tab + body per Figma). */
export function FolderGlyphIcon({ size = 31, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.5 8.5H12.5L15.5 11.5H27.5V27.5H3.5V8.5Z"
        fill="#B3B3B3"
        stroke="#F2F2F2"
      />
      <path d="M3.5 13.5H27.5V27.5H3.5V13.5Z" fill="#B3B3B3" />
    </svg>
  );
}

/** Plus glyph for “Create teams” and similar actions (18×18 in Figma). */
export function PlusIcon({ size = 18, ...props }: IconProps) {
  return (
    <SvgIcon size={size} viewBox="0 0 18 18" {...props}>
      <path d="M8 8H4V10H8V14H10V10H14V8H10V4H8V8Z" />
    </SvgIcon>
  );
}

/**
 * Team folder thumbnail (31×31): folder body with people marker per Figma teams list.
 */
export function TeamFolderGlyphIcon({ size = 31, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.5 8.5H12.5L15.5 11.5H27.5V27.5H3.5V8.5Z"
        fill="#B3B3B3"
        stroke="#F2F2F2"
      />
      <path d="M3.5 13.5H27.5V27.5H3.5V13.5Z" fill="#B3B3B3" />
      <path
        d="M15.5 16.5C16.88 16.5 18 17.62 18 19V21.5H13V19C13 17.62 14.12 16.5 15.5 16.5ZM11.5 17.75C11.1 18.29 10.85 18.94 10.8 19.62L10.75 20H8.5V18.25C8.5 17.42 9.17 16.75 10 16.75L11.5 17.75ZM19.5 17.75C20.33 17.75 21 18.42 21 19.25V20H18.75L18.7 19.62C18.65 18.94 18.4 18.29 18 17.75L19.5 17.75ZM15.5 13.5C16.44 13.5 17.25 14.19 17.44 15.08L17.5 15.5H13.5L13.56 15.08C13.75 14.19 14.56 13.5 15.5 13.5Z"
        fill="#808080"
      />
    </svg>
  );
}

/** Folder with plus — create-folder control beside view toggles (24×24). */
export function FolderPlusIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M11 2H20C20.55 2 21 2.45 21 3V8H22V9H21V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V4C3 3.45 3.45 3 4 3H11V2ZM5 5V19H19V10H12V5H5ZM14 12V14H12V16H14V18H16V16H18V14H16V12H14Z" />
    </SvgIcon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 5V19H12V5H8ZM16 5V19H20V5H16Z" />
    </SvgIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" />
    </SvgIcon>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18.364 7.05L16.95 5.636L13.414 9.172H11V11.172H13.414L16.95 14.708L18.364 13.294L14.828 9.758L18.364 7.05ZM10.586 9.758L7.05 13.294L5.636 11.88L9.172 8.344V6.344H7.172V8.344L3.636 11.88L5.05 13.294L8.586 9.758L10.586 9.758ZM14.828 9.758L13.414 11.172L11 8.758L12.414 7.344L14.828 9.758Z" />
    </SvgIcon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M13 13V18H11V13H7L12 18L17 13H13ZM12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12H4C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C9.25 4 6.824 5.387 5.385 7.5H8V9.5H2V3.5H4V6.17C5.875 3.92 8.745 2 12 2Z" />
    </SvgIcon>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M14.828 2.172L16.243 3.586L13.414 6.414L14.828 7.828L17.657 5L19.071 6.414L16.243 9.243L17.657 10.657L20.485 7.828L21.899 9.243L19.071 12.071L14.121 17.021V22H9.879V17.021L4.929 12.071L2.101 9.243L3.515 7.828L6.343 10.657L7.757 9.243L4.929 6.414L6.343 5L9.172 7.828L10.586 6.414L7.757 3.586L9.172 2.172L12 5L14.828 2.172Z" />
    </SvgIcon>
  );
}

export function MoveIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2L16 6H13V10H11V6H8L12 2ZM16 18L12 22L8 18H11V14H13V18H16ZM2 12L6 8V11H10V13H6V16L2 12ZM22 12L18 16V13H14V11H18V8L22 12Z" />
    </SvgIcon>
  );
}

export function RemoveUserIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 11C13.3261 11 14.5979 11.5268 15.5355 12.4645C16.4732 13.4021 17 14.6739 17 16V22H7V16C7 14.6739 7.52678 13.4021 8.46447 12.4645C9.40215 11.5268 10.6739 11 12 11ZM5.288 14.006C5.12886 14.5428 5.03485 15.0968 5.008 15.656L5 16V22H2V17.5C1.9998 16.6376 2.31803 15.8054 2.89363 15.1632C3.46924 14.521 4.2617 14.1139 5.119 14.02L5.289 14.006H5.288ZM18.712 14.006C19.6019 14.0602 20.4376 14.452 21.0486 15.1012C21.6596 15.7505 21.9999 16.6084 22 17.5V22H19V16C19 15.307 18.9 14.638 18.712 14.006ZM12 2C13.0609 2 14.0783 2.42143 14.8284 3.17157C15.5786 3.92172 16 4.93913 16 6C16 7.06087 15.5786 8.07828 14.8284 8.82843C14.0783 9.57857 13.0609 10 12 10C10.9391 10 9.92172 9.57857 9.17157 8.82843C8.42143 8.07828 8 7.06087 8 6C8 4.93913 8.42143 3.92172 9.17157 3.17157C9.92172 2.42143 10.9391 2 12 2ZM14 14H10V18H14V14Z" />
    </SvgIcon>
  );
}

export function MoreVerticalIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3C13.1046 3 14 3.89543 14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3ZM12 10.5C13.1046 10.5 14 11.3954 14 12.5C14 13.6046 13.1046 14.5 12 14.5C10.8954 14.5 10 13.6046 10 12.5C10 11.3954 10.8954 10.5 12 10.5ZM12 18C13.1046 18 14 18.8954 14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18Z" />
    </SvgIcon>
  );
}

export function MinusCircleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM7 11V13H17V11H7Z" />
    </SvgIcon>
  );
}

export function UserAddIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 11C13.3261 11 14.5979 11.5268 15.5355 12.4645C16.4732 13.4021 17 14.6739 17 16V22H7V16C7 14.6739 7.52678 13.4021 8.46447 12.4645C9.40215 11.5268 10.6739 11 12 11ZM5.288 14.006C5.12886 14.5428 5.03485 15.0968 5.008 15.656L5 16V22H2V17.5C1.9998 16.6376 2.31803 15.8054 2.89363 15.1632C3.46924 14.521 4.2617 14.1139 5.119 14.02L5.289 14.006H5.288ZM18.712 14.006C19.6019 14.0602 20.4376 14.452 21.0486 15.1012C21.6596 15.7505 21.9999 16.6084 22 17.5V22H19V16C19 15.307 18.9 14.638 18.712 14.006ZM12 2C13.0609 2 14.0783 2.42143 14.8284 3.17157C15.5786 3.92172 16 4.93913 16 6C16 7.06087 15.5786 8.07828 14.8284 8.82843C14.0783 9.57857 13.0609 10 12 10C10.9391 10 9.92172 9.57857 9.17157 8.82843C8.42143 8.07828 8 7.06087 8 6C8 4.93913 8.42143 3.92172 9.17157 3.17157C9.92172 2.42143 10.9391 2 12 2ZM19 8V11H22V13H19V16H17V13H14V11H17V8H19Z" />
    </SvgIcon>
  );
}

export function FileGlyphIcon({ size = 31, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M24.8711 0.5L27.6904 3.30664L30.5 6.12305V30.5H0.5V0.5H24.8711Z"
        fill="#B3B3B3"
        stroke="#F2F2F2"
      />
      <line x1="6.4875" y1="11.8633" x2="24.8875" y2="11.8633" stroke="#F2F2F2" strokeWidth="2" />
      <line x1="6.4875" y1="19.1875" x2="24.8875" y2="19.1875" stroke="#F2F2F2" strokeWidth="2" />
    </svg>
  );
}

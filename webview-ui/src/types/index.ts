// Export all vscode element types
export type {
  VscodeCommonAttributes,
  VscodeButtonAttributes,
  VscodeTextFieldAttributes,
  VscodeTextAreaAttributes,
  VscodeCheckboxAttributes,
  VscodeRadioAttributes,
  VscodeRadioGroupAttributes,
  VscodeDropdownAttributes,
  VscodeOptionAttributes,
  VscodeDividerAttributes,
  VscodeLinkAttributes,
  VscodeTagAttributes,
  VscodeBadgeAttributes,
  VscodePanelsAttributes,
  VscodePanelTabAttributes,
  VscodePanelViewAttributes,
  VscodeProgressRingAttributes,
  VscodeDataGridAttributes,
  VscodeDataGridRowAttributes,
  VscodeDataGridCellAttributes,
} from './vscode-elements';

// Type for vscode API messages
export interface VscodeMessage {
  type: string;
  value?: any;
  [key: string]: any;
}

// Handler type for vscode messages
export type VscodeMessageHandler = (message: VscodeMessage) => void;

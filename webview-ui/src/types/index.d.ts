export type { VscodeCommonAttributes, VscodeButtonAttributes, VscodeTextFieldAttributes, VscodeTextAreaAttributes, VscodeCheckboxAttributes, VscodeRadioAttributes, VscodeRadioGroupAttributes, VscodeDropdownAttributes, VscodeOptionAttributes, VscodeDividerAttributes, VscodeLinkAttributes, VscodeTagAttributes, VscodeBadgeAttributes, VscodePanelsAttributes, VscodePanelTabAttributes, VscodePanelViewAttributes, VscodeProgressRingAttributes, VscodeDataGridAttributes, VscodeDataGridRowAttributes, VscodeDataGridCellAttributes, } from './vscode-elements';
export interface VscodeMessage {
    type: string;
    value?: any;
    [key: string]: any;
}
export type VscodeMessageHandler = (message: VscodeMessage) => void;

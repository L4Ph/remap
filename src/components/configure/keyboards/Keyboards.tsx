import React from 'react';
import './Keyboards.scss';
import KeyboardModel from '../../../models/KeyboardModel';
import { Badge, Chip, withStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyModel from '../../../models/KeyModel';
import Keycap from '../keycap/Keycap.container';
import {
  KeyboardsActionsType,
  KeyboardsStateType,
} from './Keyboards.container';
import ConfigurationDialog from '../configuration/ConfigurationDialog.container';
import { IKeymap } from '../../../services/hid/Hid';

export const BORDER_WIDTH = 4;
export const LAYOUT_PADDING = 16;

type KeycapData = {
  model: KeyModel;
  keymap: IKeymap;
  remap: IKeymap | null;
};

type OwnProps = {};

type KeyboardsProps = OwnProps &
  Partial<KeyboardsActionsType> &
  Partial<KeyboardsStateType>;

type KeyboardsState = {
  keyboard: KeyboardModel; // TODO: to be redux
  configurationDialog: boolean;
};

export default class Keyboards extends React.Component<
  KeyboardsProps,
  KeyboardsState
> {
  constructor(props: KeyboardsProps | Readonly<KeyboardsProps>) {
    super(props);
    const kbd = new KeyboardModel(this.props.keyboardKeymap!);
    this.state = {
      keyboard: kbd,
      configurationDialog: false,
    };
  }

  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: KeyboardsProps, nextState: KeyboardsState) {
    if (this.props.keyboardKeymap != nextProps.keyboardKeymap) {
      const kbd = new KeyboardModel(nextProps.keyboardKeymap!);
      this.setState({ keyboard: kbd });
    }
    return true;
  }

  onClickLayer = (layer: number) => {
    this.props.onClickLayerNumber!(layer);
  };

  private openConfigurationDialog() {
    this.setState({ configurationDialog: true });
  }

  private closeConfigurationDialog() {
    this.setState({ configurationDialog: false });
  }

  render() {
    let layoutOptions = undefined;
    const hasKeyboardOptions = 0 < this.props.selectedKeyboardOptions!.length;
    if (hasKeyboardOptions) {
      const selectedKeyboardOptions: (string | null)[] = this.props
        .selectedKeyboardOptions!;
      const labels: (string | string[])[] = this.props.keyboardLabels!;

      layoutOptions = labels.map((choices: string | string[], index) => {
        if (typeof choices == 'string') {
          const selected: string | null = selectedKeyboardOptions[index];
          return selected
            ? { option: '' + index, optionChoice: '1' }
            : { option: '' + index, optionChoice: '0' };
        } else {
          const choice: string = selectedKeyboardOptions[index] as string;
          const choiceIndex = choices.indexOf(choice) - 1; // first item of choices is for choice's label
          return { option: '' + index, optionChoice: '' + choiceIndex };
        }
      });
    }

    const { keymaps, width, height, left } = this.state.keyboard.getKeymap(
      layoutOptions
    );
    this.props.setKeyboardSize!(width, height);
    const {
      vendorId,
      productId,
      productName,
    } = this.props.keyboard!.getInformation();

    // TODO: performance tuning
    const deviceKeymaps = this.props.keymaps![this.props.selectedLayer!];
    const remaps = this.props.remaps![this.props.selectedLayer!];
    const keycaps: KeycapData[] = [];
    keymaps.forEach((model) => {
      const pos = model.pos;
      if (model.pos in deviceKeymaps) {
        const keymap: IKeymap = deviceKeymaps[pos];
        const remap: IKeymap | null = pos in remaps ? remaps[pos] : null;
        keycaps.push({ model, keymap, remap });
      } else {
        console.log(`No keymap on device: ${model.location}`);
      }
    });
    return (
      <React.Fragment>
        <div className="keyboards">
          <div
            className="keyboard-root"
            style={{
              width: width + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
              height: height + (BORDER_WIDTH + LAYOUT_PADDING) * 2,
            }}
          >
            <div
              className="keyboard-frame"
              style={{ width: width, height: height, marginLeft: -left }}
            >
              {keycaps.map((keycap: KeycapData) => {
                return keycap.model.isDecal ? (
                  ''
                ) : (
                  <Keycap key={keycap.model.location} {...keycap} />
                );
              })}
            </div>
          </div>
        </div>
        <ConfigurationDialog
          open={this.state.configurationDialog}
          onClose={this.closeConfigurationDialog.bind(this)}
          vendorId={vendorId}
          productId={productId}
          productName={productName}
        />
      </React.Fragment>
    );
  }
}

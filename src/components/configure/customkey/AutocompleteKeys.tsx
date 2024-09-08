import React from 'react';
import './AutocompleteKeys.scss';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import type { IKeymap } from '../../../services/hid/Hid';
import type { KeymapCategory } from '../../../services/hid/KeycodeList';

/**
 * Filter and sort strategy.
 * CASE INSENSITIVE
 * 1st priority: Match a key's label.
 * 2nd priority: Match a kinds.
 */
const filterOptions = (
  options: IKeymap[],
  { inputValue }: { inputValue: string }
): IKeymap[] => {
  const value = inputValue.toLowerCase();
  const result: IKeymap[] = [];

  for (const option of options) {
    const labelMatched = option.keycodeInfo.label.toLowerCase().includes(value);
    const keywordMatched = option.keycodeInfo.keywords.some((kwd) =>
      kwd.includes(value)
    );
    const kindsMatched = option.kinds
      .join('::')
      .replaceAll('_', '-')
      .toLowerCase()
      .includes(value);

    if (labelMatched || keywordMatched || kindsMatched) {
      result.push(option);
    }
  }

  return result.sort((a, b) => {
    const aHasBasic = a.kinds.includes('basic') ? 1 : 0;
    const bHasBasic = b.kinds.includes('basic') ? 1 : 0;
    return bHasBasic - aHasBasic;
  });
};


type OwnProps = {
  autoFocus: boolean;
  keycodeOptions: IKeymap[];
  keycodeInfo: IKeymap | null;
  label: string;
  showKinds?: boolean;
  disabled?: boolean;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (keycodeInfo: IKeymap | null) => void;
};

type OwnState = {
  inputValue: string;
};

export default class AutocompleteKeys extends React.Component<
  OwnProps,
  OwnState
> {
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  private updateValue(value: IKeymap | string | null) {
    if (typeof value !== 'string') {
      this.props.onChange(value);
    }
  }

  private setInputValue(inputValue: string) {
    this.setState({ inputValue });
  }
  render() {
    return (
      <Autocomplete
        className={this.props.className || undefined}
        disabled={this.props.disabled}
        autoHighlight
        freeSolo
        size="small"
        options={this.props.keycodeOptions}
        filterOptions={filterOptions}
        value={this.props.keycodeInfo}
        onChange={(event: any, newValue: string | IKeymap | null) => {
          this.updateValue(newValue as IKeymap);
        }}
        inputValue={this.state.inputValue}
        onInputChange={(event, newInputValue) => {
          this.setInputValue(newInputValue.split('::')[0]);
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          return `${option.keycodeInfo?.label}::${option.kinds.join('::')}`;
        }}
        renderOption={(props, option) => (
          <li {...props}>
            <div className="customkey-auto-select-item">
              <div className="keycode-auto-label-wrapper">
                <div className="keycode-auto-label">
                  {option.keycodeInfo?.label}
                </div>
                {this.props.showKinds !== false && (
                  <div className="keycode-auto-category">
                    {kinds2CategoryLabel(option.kinds)}
                  </div>
                )}
              </div>
              {option.desc && (
                <div className="keycode-auto-desc">{option.desc}</div>
              )}
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={this.props.label}
            variant="outlined"
            autoFocus={this.props.autoFocus}
            onFocus={(evt) => {
              setTimeout(() => evt.target.select(), 300); // need to have short duration to work "select" in case of an Autocomplete component.
            }}
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    );
  }
}

export const kinds2CategoryLabel = (kinds: KeymapCategory[]): string => {
  const cat = kinds
    .map((k) => {
      return k
        .split('_')
        .flatMap((text) => text.charAt(0).toUpperCase() + text.slice(1))
        .join('-');
    })
    .join('/');
  return cat;
};

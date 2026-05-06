import React from "@moonlight-mod/wp/react";
import TextInput from "@moonlight-mod/wp/discord/uikit/TextInput";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import classNames from "@moonlight-mod/wp/classnames";
import Text from "@moonlight-mod/wp/discord/design/components/Text/Text";

interface SliderProps {
  disabled?: boolean;
  isFocused: boolean;
  maxValue: number;
  minValue?: number;
  onChange: (volume: number) => void;
  onClose: (...args: unknown[]) => void;
  onInteraction?: (...args: unknown[]) => void;
  value: number;
}

type SliderType = React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<HTMLDivElement>>;

interface SliderTextInputWrapperProps {
  slider: React.ReactElement;
  minValue?: number;
  maxValue: number;
  value: number;
  onChange: (volume: number) => void;
}

function SliderTextInputWrapper({ slider, minValue, maxValue, value: v, onChange }: SliderTextInputWrapperProps) {
  const [value, setValue] = React.useState(v?.toFixed?.(0).toString());
  const [errorState, setErrorState] = React.useState(false);
  React.useEffect(() => {
    const valueNum = Number(value);
    if (valueNum > maxValue || (valueNum === 0 && value !== "0")) {
      setErrorState(true);
      return;
    }
    onChange(valueNum);
    if (errorState) setErrorState(false);
  }, [value]);

  React.useEffect(() => {
    setValue(() => v?.toFixed?.(0).toString());
  }, [v]);
  return (
    <div>
      {slider}
      <div
        className={classNames("volumeManipulator", {
          "volumeManipulator-errorState": errorState,
        })}
      >
        <TextInput
          type="number"
          id="volume"
          // @ts-expect-error outdated type
          size="sm"
          min={minValue}
          max={maxValue}
          value={value}
          onKeyDown={(event) => event.stopPropagation()}
          onChange={(value: string) => {
            setValue(value);
          }}
          className={"volumeManipulator-input"}
        />
        <Text variant="eyebrow" className="volumeManipulator-suffix">
          %
        </Text>
      </div>
    </div>
  );
}

export function _enhanceSlider(Slider: SliderType, props: SliderProps) {
  const { value, onChange, minValue } = props;
  const maxValue = moonlight.getConfigOption<number>("volumeManipulator", "maxVolume") ?? 500;

  const slider = React.useMemo(() => <Slider {...props} maxValue={maxValue} />, [Slider, props, maxValue]);

  return (
    <ErrorBoundary>
      <SliderTextInputWrapper
        value={value}
        onChange={onChange}
        minValue={minValue}
        maxValue={maxValue}
        slider={slider}
      />
    </ErrorBoundary>
  );
}

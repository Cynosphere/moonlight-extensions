export default function BetterUploadButtonPropsFixer(props: Record<string, any>, newProps = {}) {
  Object.defineProperties(props, Object.getOwnPropertyDescriptors(newProps));
  props.onContextMenu = props.onClick;
  props.onClick = props.onDoubleClick;
  return props;
}

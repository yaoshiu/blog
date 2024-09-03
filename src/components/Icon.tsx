import {
  icon,
  type IconLookup,
  type IconName,
  type IconParams,
} from "@fortawesome/fontawesome-svg-core";
import { splitProps } from "solid-js";

/**
 * Icon component
 * @param props - Icon properties
 * @param props.icon - Icon name or lookup object
 * @returns Icon node
 */
export const FontAwesome = (
  props: IconParams & { icon: IconLookup | IconName },
) => {
  const [local, others] = splitProps(props, ["icon"]);

  const iconNode = icon(local.icon, others).node[0];

  return iconNode;
};

export default FontAwesome;

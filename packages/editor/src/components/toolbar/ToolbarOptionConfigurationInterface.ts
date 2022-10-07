/**
 * Interface for menu configuration.
 * One of these properties must be set: onClick, render or options.
 * Property onClick is the event handler for a common button   of this menu. Set options for a submenu or render for a custom element in place (from the second level onwards).
 * On the first level option has priority over onClick. Second level onwards render is the first option.
 */
export interface ToolbarOptionConfiguration {
  /**
   * the React element for put in menu entry button
   */
  icon?: React.ReactElement | (() => React.ReactElement);
  /**
   * text for menu entry tooltip
   */
  tooltip?: string;
  /**
   * the event handler for a common button
   */
  onClick?: (event: any) => void;
  /**
   * custom element for a menu entry
   */
  render?: (closeMenu: () => void) => React.ReactElement;
  /**
   * submenu options. If null, a divider will be inserted.
   */
  options?: (ToolbarOptionConfiguration | null)[];
  /**
   * option is disabled
   */
  disabled?: () => boolean;
  /**
   * option is selected
   */
  selected?: () => boolean;
  /**
   * for submenu popover, if true, popover will not be closed when mouse leave it.
   */
  useClickToClose?: boolean;
  /**
   * if false the nmenu entry or button is not visible. Also custom render will be ignored.
   */
  visible?: boolean;
}

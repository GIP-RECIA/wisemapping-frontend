/*
 *    Copyright [2021] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Popover from '@mui/material/Popover';
import Model from '../classes/model/editor';
import {
  buildEditorAppBarConfiguration,
  buildToolbarConfig,
  buildZoomToolbarConfiguration,
} from './toolbar/toolbarConfigurationBuilder';

import { IntlProvider } from 'react-intl';
import { DesignerKeyboard, MindplotWebComponent } from '@wisemapping/mindplot';
import I18nMsg from '../classes/i18n-msg';
import Toolbar from './toolbar';
import { theme as defaultEditorTheme } from '../theme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Theme } from '@mui/material/styles';
import { Notifier } from './warning-dialog/styled';
import WarningDialog from './warning-dialog';
import DefaultWidgetManager from '../classes/default-widget-manager';
import AppBar from './app-bar';
import { EditorProps } from '..';
import Capability from '../classes/action/capability';

const Editor = ({
  mapId,
  options,
  persistenceManager,
  onAction,
  theme,
  accountConfiguration,
}: EditorProps) => {
  const [mindplotComponent, setMindplotComponent]: [MindplotWebComponent | undefined, Function] =
    useState();
  const [model, setModel]: [MindplotWebComponent | undefined, Function] = useState();
  const editorTheme: Theme = theme ? theme : defaultEditorTheme;
  const [toolbarsRerenderSwitch, setToolbarsRerenderSwitch] = useState(0);
  const toolbarConfiguration = useRef([]);

  const [popoverOpen, popoverTarget, widgetManager] = DefaultWidgetManager.create();
  const capability = new Capability(options.mode, options.locked);

  const mindplotRef = useCallback((component: MindplotWebComponent) => {
    setMindplotComponent(component);
  }, []);

  useEffect(() => {
    if (mindplotComponent) {
      // Initialized model ...
      const model = new Model(mindplotComponent);
      model.loadMindmap(mapId, persistenceManager, widgetManager);
      model.registerEvents(setToolbarsRerenderSwitch, capability);
      setModel(model);

      toolbarConfiguration.current = buildToolbarConfig(mindplotComponent.getDesigner());
    }
  }, [mindplotComponent !== undefined]);

  useEffect(() => {
    if (options.enableKeyboardEvents) {
      DesignerKeyboard.resume();
    } else {
      DesignerKeyboard.pause();
    }
  }, [options.enableKeyboardEvents]);

  // Initialize locate ...
  const locale = options.locale;
  const msg = I18nMsg.loadLocaleData(locale);

  const menubarConfiguration = buildEditorAppBarConfiguration(
    mindplotComponent?.getDesigner(),
    options.mapTitle,
    capability,
    onAction,
    accountConfiguration,
    () => {
      mindplotComponent.save(true);
    },
  );

  const horizontalPosition = {
    position: {
      right: '7px',
      top: '93%',
    },
    vertical: false,
  };

  // if the Toolbar is not hidden before the variable 'isMobile' is defined, it appears intermittently when the page loads
  // if the Toolbar is not rendered, Menu.ts cant find buttons for create event listeners
  // so, with this hack the Toolbar is rendered but no visible until the variable 'isMobile' is defined
  return (
    <ThemeProvider theme={editorTheme}>
      <IntlProvider locale={locale} messages={msg}>
        <AppBar configurations={menubarConfiguration} />
        <Popover
          id="popover"
          open={popoverOpen}
          anchorEl={popoverTarget}
          onClose={widgetManager.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {widgetManager.getEditorContent()}
        </Popover>
        {!capability.isHidden('edition-toolbar') && (
          <Toolbar
            configurations={toolbarConfiguration.current}
            rerender={toolbarsRerenderSwitch}
          ></Toolbar>
        )}
        <Toolbar
          configurations={buildZoomToolbarConfiguration(
            capability,
            mindplotComponent?.getDesigner(),
          )}
          position={horizontalPosition}
          rerender={toolbarsRerenderSwitch}
        ></Toolbar>

        <mindplot-component
          ref={mindplotRef}
          id="mindmap-comp"
          mode={options.mode}
          locale={options.locale}
        ></mindplot-component>

        <Notifier id="headerNotifier"></Notifier>

        <WarningDialog
          capability={capability}
          message={options.locked ? options.lockedMsg : ''}
        ></WarningDialog>
      </IntlProvider>
    </ThemeProvider>
  );
};
export default Editor;
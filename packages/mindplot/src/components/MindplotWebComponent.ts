import Designer from './Designer';
import buildDesigner from './DesignerBuilder';
import DesignerOptionsBuilder from './DesignerOptionsBuilder';
import EditorRenderMode from './EditorRenderMode';
import PersistenceManager from './PersistenceManager';
import WidgetManager from './WidgetManager';
import mindplotStyles from './styles/mindplot-styles';
import { $notify } from './widget/ToolbarNotifier';
import { $msg } from './Messages';
import DesignerKeyboard from './DesignerKeyboard';
import LocalStorageManager from './LocalStorageManager';

export type MindplotWebComponentInterface = {
  id: string;
  mode: string;
  ref: object;
  locale?: string;
  zoom?: number;
};
/**
 * WebComponent implementation for minplot designer.
 * This component is registered as mindplot-component in customElements api. (see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
 * For use it you need to import minplot.js and put in your DOM a <mindplot-component/> tag. In order to create a Designer on it you need to call its buildDesigner method. Maps can be loaded throught loadMap method.
 */
class MindplotWebComponent extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  private _designer: Designer;

  private saveRequired: boolean;

  private _isLoaded: boolean;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });

    const mindplotStylesElement = document.createElement('style');
    mindplotStylesElement.innerHTML = mindplotStyles;
    this._shadowRoot.appendChild(mindplotStylesElement);

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wise-editor');
    wrapper.setAttribute('id', 'mindplot');

    this._shadowRoot.appendChild(wrapper);
  }

  /**
   * @returns the designer
   */
  getDesigner(): Designer {
    return this._designer;
  }

  /**
   * Build the designer of the component
   * @param {PersistenceManager} persistence the persistence manager to be used. By default a LocalStorageManager is created
   * @param {UIManager} widgetManager an UI Manager to override default Designer option.
   */
  buildDesigner(persistence?: PersistenceManager, widgetManager?: WidgetManager) {
    const editorRenderMode = this.getAttribute('mode') as EditorRenderMode;
    const locale = this.getAttribute('locale');
    const zoom = this.getAttribute('zoom');

    const persistenceManager = persistence || new LocalStorageManager('map.xml', false, false);
    const mode = editorRenderMode || 'viewonly';
    const options = DesignerOptionsBuilder.buildOptions({
      persistenceManager,
      mode,
      widgetManager,
      divContainer: this._shadowRoot.getElementById('mindplot'),
      container: 'mindplot',
      zoom: zoom ? Number.parseFloat(zoom) : 1,
      locale: locale || 'en',
    });
    this._designer = buildDesigner(options);
    this._designer.addEvent('modelUpdate', () => {
      this.setSaveRequired(true);
    });

    this.registerShortcuts();

    this._designer.addEvent('loadSuccess', (): void => {
      this._isLoaded = true;
    });

    return this._designer;
  }

  isLoaded(): boolean {
    return this._isLoaded;
  }

  private registerShortcuts() {
    const designerKeyboard = DesignerKeyboard.getInstance();
    if (designerKeyboard) {
      designerKeyboard.addShortcut(['ctrl+s', 'meta+s'], () => {
        this.save(true);
      });
    }
  }

  setSaveRequired(value: boolean) {
    this.saveRequired = value;
  }

  getSaveRequired() {
    return this.saveRequired;
  }

  loadMap(id: string): Promise<void> {
    const instance = PersistenceManager.getInstance();
    return instance.load(id).then((mindmap) => this._designer.loadMap(mindmap));
  }

  save(saveHistory: boolean) {
    if (!saveHistory && !this.getSaveRequired()) return;
    console.log('Saving...');
    // Load map content ...
    const mindmap = this._designer.getMindmap();
    const mindmapProp = this._designer.getMindmapProperties();

    // Display save message ..
    if (saveHistory) {
      $notify($msg('SAVING'));
    }

    // Call persistence manager for saving ...
    const persistenceManager = PersistenceManager.getInstance();
    persistenceManager.save(mindmap, mindmapProp, saveHistory, {
      onSuccess() {
        if (saveHistory) {
          $notify($msg('SAVE_COMPLETE'));
        }
      },
      onError(error) {
        if (saveHistory) {
          $notify(error.message);
        }
      },
    });
    this.setSaveRequired(false);
  }

  unlockMap() {
    const mindmap = this._designer.getMindmap();
    const persistenceManager = PersistenceManager.getInstance();

    // If the map could not be loaded, partial map load could happen.
    if (mindmap) {
      persistenceManager.unlockMap(mindmap.getId());
    }
  }
}

export default MindplotWebComponent;

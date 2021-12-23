import '../css/editor.less';
import { buildDesigner, buildDefaultOptions, loadExample } from '../../../../src/components/DesignerBuilder';
import { PersistenceManager, LocalStorageManager } from '../../../../src';

const example = async () => {
  const p = new LocalStorageManager('samples/{id}.xml');
  const options = buildDefaultOptions(p, true);
  const designer = buildDesigner(options);

  designer.addEvent('loadSuccess', () => {
    document.getElementById('mindplot').classList.add('ready');
  });

  // Load map from XML file persisted on disk...
  const mapId = 'welcome';
  const persistence = PersistenceManager.getInstance();
  const mindmap = persistence.load(mapId);
  designer.loadMap(mindmap);
};

loadExample(example);

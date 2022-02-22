/* eslint-disable no-unused-vars */
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
import { $assert } from '@wisemapping/core-js';
import { Mindmap } from '..';
import XMLSerializerFactory from './persistence/XMLSerializerFactory';

abstract class PersistenceManager {
  // eslint-disable-next-line no-use-before-define
  static _instance: PersistenceManager;

  save(mindmap: Mindmap, editorProperties, saveHistory: boolean, events, sync: boolean) {
    $assert(mindmap, 'mindmap can not be null');
    $assert(editorProperties, 'editorProperties can not be null');

    const mapId = mindmap.getId();
    $assert(mapId, 'mapId can not be null');

    const serializer = XMLSerializerFactory.createInstanceFromMindmap(mindmap);
    const domMap = serializer.toXML(mindmap);
    const mapXml = new XMLSerializer().serializeToString(domMap);

    const pref = JSON.stringify(editorProperties);
    try {
      this.saveMapXml(mapId, mapXml, pref, saveHistory, events, sync);
    } catch (e) {
      console.error(e);
      events.onError(e);
    }
  }

  load(mapId: string) {
    $assert(mapId, 'mapId can not be null');
    const domDocument = this.loadMapDom(mapId);
    return PersistenceManager.loadFromDom(mapId, domDocument);
  }

  abstract discardChanges(mapId: string): void;

  abstract loadMapDom(mapId: string): Document;

  abstract saveMapXml(mapId: string, mapXml, pref, saveHistory, events, sync);

  abstract unlockMap(mindmap: Mindmap): void;

  static init = (instance: PersistenceManager) => {
    this._instance = instance;
  };

  static getInstance(): PersistenceManager {
    return this._instance;
  }

  static loadFromDom(mapId: string, mapDom: Document) {
    $assert(mapId, 'mapId can not be null');
    $assert(mapDom, 'mapDom can not be null');

    const serializer = XMLSerializerFactory.createInstanceFromDocument(mapDom);
    return serializer.loadFromDom(mapDom, mapId);
  }
}

export default PersistenceManager;
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
import { Mindmap } from '../..';
import XMLSerializerFactory from '../persistence/XMLSerializerFactory';
import Exporter from './Exporter';

class WiseXMLExporter implements Exporter {
  mindmap: Mindmap;

  constructor(mindmap: Mindmap) {
    this.mindmap = mindmap;
  }

  extension(): string {
    return 'wxml';
  }

  export(): Promise<string> {
    const { mindmap } = this;
    const serializer = XMLSerializerFactory
      .createInstanceFromMindmap(mindmap);
    const document: Document = serializer.toXML(mindmap);

    const xmlStr: string = new XMLSerializer()
      .serializeToString(document);
    const blob = new Blob([xmlStr], { type: 'application/xml' });
    const result = URL.createObjectURL(blob);
    return Promise.resolve(result);
  }
}
export default WiseXMLExporter;
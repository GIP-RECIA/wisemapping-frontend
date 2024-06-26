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
import { $assert } from '@gip-recia/wisemapping-core-js';
import PersistenceManager from './PersistenceManager';
import Designer from './Designer';
import { DesignerOptions } from './DesignerOptionsBuilder';

let designer: Designer;

export function buildDesigner(options: DesignerOptions): Designer {
  const containerElem = options.divContainer;
  $assert(containerElem, 'container could not be null');
  if (designer) {
    throw new Error('Designer can does not support multiple initializations');
  }

  // Register load events ...
  designer = new Designer(options);

  // Configure default persistence manager ...
  const persistence = options.persistenceManager;
  PersistenceManager.init(persistence!);

  return designer;
}

export default buildDesigner;

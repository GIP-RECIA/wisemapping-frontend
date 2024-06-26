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
import { $defined } from '@gip-recia/wisemapping-core-js';
import ElementPeer from '../svg/ElementPeer';

class EventUtils {
  static broadcastChangeEvent(elementPeer: ElementPeer, type: string) {
    const listeners = elementPeer.getChangeEventListeners(type);
    if ($defined(listeners)) {
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener.call(elementPeer, null);
      }
    }

    elementPeer
      .getChildren()
      .forEach((child: ElementPeer) => EventUtils.broadcastChangeEvent(child, type));
  }
}

export default EventUtils;

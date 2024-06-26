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
import { Group, Image } from '@gip-recia/wisemapping-web2d';
import IconGroup from './IconGroup';
import FeatureModel from './model/FeatureModel';
import PositionType from './PositionType';
import SizeType from './SizeType';

interface Icon {
  getElement(): Group | Image;

  setGroup(group: IconGroup): void;

  getGroup(): IconGroup | null;

  getSize(): SizeType | undefined;

  getPosition(): PositionType;

  addEvent(type: string, fnc: () => void): void;

  remove(): void;

  getModel(): FeatureModel;
}

export default Icon;

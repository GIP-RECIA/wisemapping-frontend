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
import { StraightLine } from '@gip-recia/wisemapping-web2d';
import SizeType from '../SizeType';
import DefaultTopicShape from './DefaultShape';

class LineTopicShape extends DefaultTopicShape<StraightLine> {
  private _size: SizeType | null;

  constructor(borderColor: string) {
    const shape = new StraightLine({ strokeWidth: 2, strokeColor: borderColor });
    super(shape, 'image');
    this._size = null;
  }

  setSize(width: number, height: number): void {
    this._size = { width, height };
    this.getShape().setFrom(0, height);
    this.getShape().setTo(width, height);
  }

  getSize(): SizeType | null {
    return this._size;
  }

  setPosition() {
    // Overwrite behaviour ...
  }

  setFill() {
    // Overwrite behaviour ...
  }
}

export default LineTopicShape;

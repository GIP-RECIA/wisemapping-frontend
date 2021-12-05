/*    Copyright [2015] [wisemapping]
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
import { $defined, $assert, createDocument, innerXML } from '@wisemapping/core-js';
import ModelCodeName from './ModelCodeName';
import Mindmap from '../model/Mindmap';
import INodeModel from '../model/INodeModel';
import TopicFeature from '../TopicFeature';

class XMLSerializer_Beta {
  toXML(mindmap) {
    $assert(mindmap, 'Can not save a null mindmap');

    const document = createDocument();

    // Store map attributes ...
    const mapElem = document.createElement('map');
    const name = mindmap.getId();
    if ($defined(name)) {
      mapElem.setAttribute('name', name);
    }
    document.append(mapElem);

    // Create branches ...
    const topics = mindmap.getBranches();
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const topicDom = this._topicToXML(document, topic);
      mapElem.append(topicDom);
    }

    return document;
  }

  _topicToXML(document, topic) {
    const parentTopic = document.createElement('topic');

    // Set topic attributes...
    if (topic.getType() === INodeModel.CENTRAL_TOPIC_TYPE) {
      parentTopic.setAttribute('central', true);
    } else {
      const parent = topic.getParent();
      if (parent == null || parent.getType() === INodeModel.CENTRAL_TOPIC_TYPE) {
        const pos = topic.getPosition();
        parentTopic.setAttribute('position', `${pos.x},${pos.y}`);
      } else {
        const order = topic.getOrder();
        parentTopic.setAttribute('order', order);
      }
    }

    const text = topic.getText();
    if ($defined(text)) {
      parentTopic.setAttribute('text', text);
    }

    const shape = topic.getShapeType();
    if ($defined(shape)) {
      parentTopic.setAttribute('shape', shape);
    }

    if (topic.areChildrenShrunken()) {
      parentTopic.setAttribute('shrink', true);
    }

    // Font properties ...
    let font = '';

    const fontFamily = topic.getFontFamily();
    font += `${fontFamily || ''};`;

    const fontSize = topic.getFontSize();
    font += `${fontSize || ''};`;

    const fontColor = topic.getFontColor();
    font += `${fontColor || ''};`;

    const fontWeight = topic.getFontWeight();
    font += `${fontWeight || ''};`;

    const fontStyle = topic.getFontStyle();
    font += `${fontStyle || ''};`;

    if (
      $defined(fontFamily)
      || $defined(fontSize)
      || $defined(fontColor)
      || $defined(fontWeight)
      || $defined(fontStyle)
    ) {
      parentTopic.setAttribute('fontStyle', font);
    }

    const bgColor = topic.getBackgroundColor();
    if ($defined(bgColor)) {
      parentTopic.setAttribute('bgColor', bgColor);
    }

    const brColor = topic.getBorderColor();
    if ($defined(brColor)) {
      parentTopic.setAttribute('brColor', brColor);
    }

    // ICONS
    let i;
    const icons = topic.getIcons();
    for (i = 0; i < icons.length; i++) {
      const icon = icons[i];
      const iconDom = this._iconToXML(document, icon);
      parentTopic.append(iconDom);
    }

    // LINKS
    const links = topic.getLinks();
    for (i = 0; i < links.length; i++) {
      const link = links[i];
      const linkDom = this._linkToXML(document, link);
      parentTopic.append(linkDom);
    }

    const notes = topic.getNotes();
    for (i = 0; i < notes.length; i++) {
      const note = notes[i];
      const noteDom = this._noteToXML(document, note);
      parentTopic.append(noteDom);
    }

    // CHILDREN TOPICS
    const childTopics = topic.getChildren();
    for (i = 0; i < childTopics.length; i++) {
      const childTopic = childTopics[i];
      const childDom = this._topicToXML(document, childTopic);
      parentTopic.append(childDom);
    }

    return parentTopic;
  }

  _iconToXML(document, icon) {
    const iconDom = document.createElement('icon');
    iconDom.setAttribute('id', icon.getIconType());
    return iconDom;
  }

  _linkToXML(document, link) {
    const linkDom = document.createElement('link');
    linkDom.setAttribute('url', link.getUrl());
    return linkDom;
  }

  _noteToXML(document, note) {
    const noteDom = document.createElement('note');
    noteDom.setAttribute('text', note.getText());
    return noteDom;
  }

  loadFromDom(dom, mapId) {
    $assert(dom, 'Dom can not be null');
    $assert(mapId, 'mapId can not be null');

    // Is a valid object ?
    const { documentElement } = dom;
    $assert(
      documentElement.nodeName !== 'parsererror',
      `Error while parsing: '${documentElement.childNodes[0].nodeValue}`,
    );

    // Is a wisemap?.
    $assert(
      documentElement.tagName === XMLSerializer_Beta.MAP_ROOT_NODE,
      `This seem not to be a map document. Root Tag: '${documentElement.tagName}',HTML:${dom.innerHTML
      }XML:${innerXML(dom)}`,
    );

    // Start the loading process ...
    let version = documentElement.getAttribute('version');
    version = !$defined(version) ? ModelCodeName.BETA : version;
    const mindmap = new Mindmap(mapId, version);

    const children = documentElement.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === 1) {
        const topic = this._deserializeNode(child, mindmap);
        mindmap.addBranch(topic);
      }
    }
    mindmap.setId(mapId);
    return mindmap;
  }

  _deserializeNode(domElem, mindmap) {
    const type = domElem.getAttribute('central') != null
      ? INodeModel.CENTRAL_TOPIC_TYPE
      : INodeModel.MAIN_TOPIC_TYPE;
    const topic = mindmap.createNode(type);

    // Load attributes...
    const text = domElem.getAttribute('text');
    if ($defined(text)) {
      topic.setText(text);
    }

    const order = domElem.getAttribute('order');
    if ($defined(order)) {
      topic.setOrder(parseInt(order, 10));
    }

    const shape = domElem.getAttribute('shape');
    if ($defined(shape)) {
      topic.setShapeType(shape);
    }

    const isShrink = domElem.getAttribute('shrink');
    if ($defined(isShrink)) {
      topic.setChildrenShrunken(isShrink);
    }

    const fontStyle = domElem.getAttribute('fontStyle');
    if ($defined(fontStyle)) {
      const font = fontStyle.split(';');

      if (font[0]) {
        topic.setFontFamily(font[0]);
      }

      if (font[1]) {
        topic.setFontSize(font[1]);
      }

      if (font[2]) {
        topic.setFontColor(font[2]);
      }

      if (font[3]) {
        topic.setFontWeight(font[3]);
      }

      if (font[4]) {
        topic.setFontStyle(font[4]);
      }
    }

    const bgColor = domElem.getAttribute('bgColor');
    if ($defined(bgColor)) {
      topic.setBackgroundColor(bgColor);
    }

    const borderColor = domElem.getAttribute('brColor');
    if ($defined(borderColor)) {
      topic.setBorderColor(borderColor);
    }

    const position = domElem.getAttribute('position');
    if ($defined(position)) {
      const pos = position.split(',');
      topic.setPosition(pos[0], pos[1]);
    }

    // Creating icons and children nodes
    const children = domElem.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === 1) {
        $assert(
          child.tagName === 'topic'
          || child.tagName === 'icon'
          || child.tagName === 'link'
          || child.tagName === 'note',
          `Illegal node type:${child.tagName}`,
        );
        if (child.tagName === 'topic') {
          const childTopic = this._deserializeNode(child, mindmap);
          childTopic.connectTo(topic);
        } else if (child.tagName === 'icon') {
          const icon = this._deserializeIcon(child, topic);
          topic.addFeature(icon);
        } else if (child.tagName === 'link') {
          const link = this._deserializeLink(child, topic);
          topic.addFeature(link);
        } else if (child.tagName === 'note') {
          const note = this._deserializeNote(child, topic);
          topic.addFeature(note);
        }
      }
    }

    return topic;
  }

  _deserializeIcon(domElem) {
    let icon = domElem.getAttribute('id');
    icon = icon.replace('images/', 'icons/legacy/');
    return TopicFeature.createModel(TopicFeature.Icon.id, { id: icon });
  }

  _deserializeLink(domElem) {
    return TopicFeature.createModel(TopicFeature.Link.id, { url: domElem.getAttribute('url') });
  }

  _deserializeNote(domElem) {
    const text = domElem.getAttribute('text');
    return TopicFeature.createModel(TopicFeature.Note.id, { text: text == null ? ' ' : text });
  }
}

XMLSerializer_Beta.MAP_ROOT_NODE = 'map';

export default XMLSerializer_Beta;

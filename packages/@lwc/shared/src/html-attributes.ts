/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { AriaPropNameToAttrNameMap } from './aria';
import { hasOwnProperty, StringReplace } from './language';

/**
 * Maps boolean attribute name to supported tags: 'boolean attr name' => Set of allowed tag names
 * that supports them.
 */
const BOOLEAN_ATTRIBUTES = new Map([
    ['autofocus', new Set(['button', 'input', 'keygen', 'select', 'textarea'])],
    ['autoplay', new Set(['audio', 'video'])],
    ['checked', new Set(['command', 'input'])],
    [
        'disabled',
        new Set([
            'button',
            'command',
            'fieldset',
            'input',
            'keygen',
            'optgroup',
            'select',
            'textarea',
        ]),
    ],
    ['formnovalidate', new Set(['button'])], // button[type=submit]
    ['hidden', new Set()], // Global attribute
    ['loop', new Set(['audio', 'bgsound', 'marquee', 'video'])],
    ['multiple', new Set(['input', 'select'])],
    ['muted', new Set(['audio', 'video'])],
    ['novalidate', new Set(['form'])],
    ['open', new Set(['details'])],
    ['readonly', new Set(['input', 'textarea'])],
    ['required', new Set(['input', 'select', 'textarea'])],
    ['reversed', new Set(['ol'])],
    ['selected', new Set(['option'])],
]);

export function isBooleanAttribute(attrName: string, tagName: string): boolean {
    const allowedTagNames = BOOLEAN_ATTRIBUTES.get(attrName);
    return (
        allowedTagNames !== undefined &&
        (allowedTagNames.size === 0 || allowedTagNames.has(tagName))
    );
}

const GLOBAL_ATTRIBUTE = new Set([
    'role',
    'accesskey',
    'class',
    'contenteditable',
    'contextmenu',
    'dir',
    'draggable',
    'dropzone',
    'hidden',
    'id',
    'itemprop',
    'lang',
    'slot',
    'spellcheck',
    'style',
    'tabindex',
    'title',
]);

export function isGlobalHtmlAttribute(attrName: string): boolean {
    return GLOBAL_ATTRIBUTE.has(attrName);
}

const HTML_PROPERTIES_TO_ATTRIBUTE: Record<string, string> = {
    accessKey: 'accesskey',
    readOnly: 'readonly',
    tabIndex: 'tabindex',
    bgColor: 'bgcolor',
    colSpan: 'colspan',
    rowSpan: 'rowspan',
    contentEditable: 'contenteditable',
    crossOrigin: 'crossorigin',
    dateTime: 'datetime',
    formAction: 'formaction',
    isMap: 'ismap',
    maxLength: 'maxlength',
    minLength: 'minlength',
    noValidate: 'novalidate',
    useMap: 'usemap',
    htmlFor: 'for',
};

const CAPS_REGEX = /[A-Z]/g;

export function htmlPropertyToAttribute(propName: string): string {
    if (propName in AriaPropNameToAttrNameMap) {
        return AriaPropNameToAttrNameMap[propName];
    }

    if (!hasOwnProperty.call(HTML_PROPERTIES_TO_ATTRIBUTE, propName)) {
        HTML_PROPERTIES_TO_ATTRIBUTE[propName] = StringReplace.call(
            propName,
            CAPS_REGEX,
            (match) => '-' + match.toLowerCase()
        );
    }

    return HTML_PROPERTIES_TO_ATTRIBUTE[propName]!;
}

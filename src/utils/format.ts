import type { EndpointChronologyEvent } from "src/shared/payload/endpoint-types";
import {
  isNodeLinkNode,
  isNodeListNode,
  isNodeParagraphNode,
  isNodeTextNode,
  type RichTextContent,
  type RichTextNode,
} from "src/shared/payload/rich-text";
import { contextCache } from "src/services";

export const formatLocale = (code: string): string =>
  contextCache.languages.find(({ id }) => id === code)?.name ?? code;

export const formatInlineTitle = ({
  pretitle,
  title,
  subtitle,
}: {
  pretitle?: string | undefined;
  title: string;
  subtitle?: string | undefined;
}): string => {
  let result = "";
  if (pretitle) {
    result += `${pretitle}: `;
  }
  result += title;
  if (subtitle) {
    result += ` — ${subtitle}`;
  }
  return result;
};

export const formatRichTextToString = (content: RichTextContent): string => {
  const formatNode = (node: RichTextNode): string => {
    if (isNodeParagraphNode(node)) {
      return node.children.map(formatNode).join("");
    } else if (isNodeListNode(node)) {
      return "LIST";
    } else if (isNodeTextNode(node)) {
      return node.text;
    } else if (isNodeLinkNode(node)) {
      return node.children.map(formatNode).join("");
    }
    return "";
  };

  return content.root.children.map(formatNode).join("\n\n");
};

export const capitalize = (string: string): string => {
  const [firstLetter, ...otherLetters] = string;
  if (firstLetter === undefined) return "";
  return [firstLetter.toUpperCase(), ...otherLetters].join("");
};

export const formatTimelineDateToId = (date: EndpointChronologyEvent["date"]): string => {
  let result = date.year.toString();
  if (date.month) result += `-${date.month.toString().padStart(2, "0")}`;
  if (date.day) result += `-${date.day.toString().padStart(2, "0")}`;
  return result;
};

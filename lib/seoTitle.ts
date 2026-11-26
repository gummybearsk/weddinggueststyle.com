/**
 * Title helper (Rules 60/65): the layout template appends " | Wedding Guest Style".
 * Google cuts titles at ~60 characters, so the brand suffix is kept only when the
 * whole title still fits; otherwise the page title is used on its own.
 */
export const TITLE_SUFFIX = " | Wedding Guest Style";
export const TITLE_MAX = 60;

export function fitTitle(title: string): string | { absolute: string } {
  return title.length + TITLE_SUFFIX.length <= TITLE_MAX ? title : { absolute: title };
}

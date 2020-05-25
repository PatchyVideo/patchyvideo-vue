function getSiteTitle() {
  return document.title;
}

function changeSiteTitle(title) {
  document.title = title + " - PatchyVideo";
}

export { getSiteTitle, changeSiteTitle };

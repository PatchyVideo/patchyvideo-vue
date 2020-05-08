function getSiteTitle() {
  return document.title;
}

function changeSiteTitle(title) {
  document.title = title + " - Patchyvideo";
}

export { getSiteTitle, changeSiteTitle };

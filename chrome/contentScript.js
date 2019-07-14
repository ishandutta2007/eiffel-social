var fillIntervalID;

const fillInForm = () => {
  // check that the path matches the form ID we want
  if (`/share/${config.visitFormId}` !== window.location.pathname) { return; }

  // check that ArcGIS has finished loading the form
  const localityIdElement = document.querySelector('input[type="text"][name$="PL_LCLTY_ID"]');
  const isLoaded = localityIdElement && localityIdElement.value && localityIdElement.value.toLowerCase() === window.location.search.slice(19, 19+36).toLowerCase();
  if (!isLoaded) { return; }

  // repository = cincy
  const repositoryNumberElement = document.querySelector('input[type="text"][data-name$="REPSTY_CLLCT_ID"]');
  const repositoryTextElement = document.querySelector('input[type="text"][list$="REPSTYCLLCTID"].autocomplete');
  // const cincyElement = document.querySelector('datalist[id$="REPSTYCLLCTID"] option[value="Cincinnati Museum Center"][data-value="24"]');
  // <option value="Academy of Natural Sciences" data-value="5">
  // <option value="Cincinnati Museum Center" data-value="24">
  repositoryNumberElement.value = 24;
  repositoryTextElement.value = "Cincinnati Museum Center";

  // in situ = true, and field action = collected
  const fieldActionElement = document.querySelector('input[type="radio"][data-name$="CollectedorObserved"][value="Collected"]');
  fieldActionElement.click();
  const inSituElement = document.querySelector('input[type="radio"][data-name$="LCLTY_SPECM_SITU_TX"][value="In_Situ"]');
  inSituElement.click();

  // specimen comments from jacket data (in fragment)
  const specimenComments = decodeURIComponent(window.location.hash.slice(1));
  const specimenCommentsElement = document.querySelector('textarea[name$="LCLTY_SPECM_CMMTS"]');
  specimenCommentsElement.value = specimenComments;

  // approx # of specimens = 1
  const specimenCountElement = document.querySelector('input[type="text"][name$="NB_SPEC"]');
  specimenCountElement.value = 1;

  // we're done: clear the timer
  window.clearInterval(fillIntervalID);
};

window.onload = () => {
  fillIntervalID = window.setInterval(fillInForm, 100);
};

var fillIntervalID;
const triggerChange = (element) => {
  const event = new Event('change', { bubbles: true, cancelable: false });
  element.dispatchEvent(event);
};

const fillInForm = () => {
  // check that the path matches the form ID we want
  if (`/share/${config.visitFormId}` !== window.location.pathname) { window.clearInterval(fillIntervalID); return; }

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
  triggerChange(repositoryNumberElement);

  // in situ = true, and field action = collected
  const fieldActionElement = document.querySelector('input[type="radio"][data-name$="CollectedorObserved"][value="Collected"]');
  fieldActionElement.click();
  const inSituElement = document.querySelector('input[type="radio"][data-name$="LCLTY_SPECM_SITU_TX"][value="In_Situ"]');
  inSituElement.click();

  // guess taxon from locality
  const taxonNumberElement = document.querySelector('input[type="text"][data-name$="TAXA_ID"]');
  const taxonTextElement = document.querySelector('input[type="text"][list*="TAXAID"].autocomplete');
  const localityId = localityIdElement.value.toUpperCase();
  if (localityId in config.localityTaxa) {
    const taxon = config.localityTaxa[localityId];
    taxonNumberElement.value = taxaIds[taxon];
    taxonTextElement.value = taxon;
    triggerChange(taxonNumberElement);
  }

  // specimen comments from jacket data (in field:LCLTY_SPECM_CMMTS that gets ignored because it's in a repeat)
  const specimenCommentsIndex = window.location.search.indexOf('field:LCLTY_SPECM_CMMTS=');
  if (specimenCommentsIndex > -1) {
    const specimenComments = decodeURIComponent(window.location.search.slice(specimenCommentsIndex + 24));
    const specimenCommentsElement = document.querySelector('textarea[name$="LCLTY_SPECM_CMMTS"]');
    specimenCommentsElement.value = specimenComments;
    triggerChange(specimenCommentsElement);
  }

  // approx # of specimens = 1
  const specimenCountElement = document.querySelector('input[type="text"][name$="NB_SPEC"]');
  specimenCountElement.value = 1;
  triggerChange(specimenCountElement);

  // we're done: clear the timer
  window.clearInterval(fillIntervalID);
};

window.onload = () => {
  fillIntervalID = window.setInterval(fillInForm, 100);
};
